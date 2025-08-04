const { Persona, Empleado, Usuario } = require("../../models/init");
const sequelize = require("../../models/db"); // transacciones
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
  try {
    const usuario = await Persona.findOne({
      where: { dni },
      include: {
        model: Empleado,
        as: "empleado",
        include: { model: Usuario, as: "usuario" },
      },
    });
    if (!usuario) {
      return renderUser(res, {
        dni,
        mensajeAlert: ["No se encontró el usuario con el DNI proporcionado."],
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
module.exports = {
  getUser,
};
