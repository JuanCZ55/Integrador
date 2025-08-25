const { Persona, Empleado, Usuario } = require("../../models/init");
const sequelize = require("../../models/db"); // transacciones
const bcrypt = require("bcrypt");

function validator(dni, username, password) {
  const errores = [];
  if (!dni || dni.trim().length === 0) {
    errores.push("El campo DNI es obligatorio.");
  }
  if (!username || username.trim().length === 0) {
    errores.push("El campo nombre de usuario es obligatorio.");
  }
  if (!password || password.length === 0) {
    errores.push("El campo contraseña es obligatorio.");
  }
  if (errores.length > 0) {
    return errores;
  }
  const regexDni = /^[0-9]{7,8}$/;
  const regexUsername = /^[a-zA-Z0-9._-]{3,20}$/;
  const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d._-]{8,}$/;
  if (!regexDni.test(dni)) {
    errores.push("El campo DNI debe contener entre 7 y 8 dígitos.");
  }
  if (!regexUsername.test(username)) {
    errores.push(
      "El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede incluir letras, números y los símbolos (- _ .)."
    );
  }
  if (!regexPassword.test(password)) {
    errores.push(
      "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra, un número y puede incluir (- _ .)."
    );
  }

  return errores;
}

function renderUser(
  res,
  { dni, username, mensajeAlert = [], alertClass = "" }
) {
  return res.render("admin/usuarios", {
    dni,
    username,
    mensajeAlert,
    alertClass,
  });
}
async function getUser(req, res) {
  const dni = req.query.dni;
  if (dni === undefined) {
    return renderUser(res, {});
  }
  if (!/^\d{7,8}$/.test(dni)) {
    return renderUser(res, {
      dni,
      mensajeAlert: ["El DNI debe contener entre 7 y 8 dígitos."],
      alertClass: "alert-warning",
    });
  }
  try {
    const usuario = await Persona.findOne({
      where: { dni },
      include: {
        model: Empleado,
        as: "empleado",
        include: { model: Usuario, as: "usuario" },
      },
    });
    if (!usuario || !usuario.empleado) {
      return renderUser(res, {
        dni,
        mensajeAlert: [
          "Primero cree al empleado/profesional. Luego podra crear al usuario",
        ],
        alertClass: "alert-warning",
      });
    }
    return renderUser(res, {
      dni,
      username: usuario.empleado.usuario.usuario,
    });
  } catch (error) {
    console.error("error en getUser", error);
    return renderUser(res, {
      mensajeAlert: ["Error al buscar el usuario."],
      alertClass: "alert-warning",
    });
  }
}
async function postUser(req, res) {
  const { dni, username, password } = req.body;
  const errores = validator(dni, username, password);
  if (errores.length > 0) {
    return renderUser(res, {
      dni,
      username,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  try {
    const empleado = await Persona.findOne({
      where: { dni },
      include: { model: Empleado, as: "empleado" },
    });
    const id = empleado.empleado.id_empleado;
    const rol = empleado.empleado.id_rol;
    if (!empleado || !id) {
      return renderUser(res, {
        dni,
        mensajeAlert: [
          "Primero cree al empleado/profesional. Luego podra crear al usuario",
        ],
        alertClass: "alert-warning",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.upsert({
      id_empleado: id,
      id_rol: rol,
      usuario: username,
      password: hashedPassword,
      estado: true,
    });

    return renderUser(res, {
      mensajeAlert: ["Usuario creado exitosamente."],
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error("error en postUser", error);
    return renderUser(res, {
      mensajeAlert: ["Error al crear el usuario."],
      alertClass: "alert-danger",
    });
  }
}
module.exports = {
  getUser,
  postUser,
};
