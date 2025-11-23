const { Usuario } = require("../models/init");
const bcrypt = require("bcrypt");

async function renderPerfil(req, res) {
  try {
    res.render("perfil");
  } catch (error) {
    console.error("Error al renderizar perfil:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function cambiarPassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id_usuario;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.render("perfil", {
        mensajeAlert: ["Usuario no encontrado"],
        alertClass: "alert-danger",
      });
    }

    const isValidPassword = await usuario.validarPassword(currentPassword);
    if (!isValidPassword) {
      return res.render("perfil", {
        mensajeAlert: ["La contraseña actual es incorrecta"],
        alertClass: "alert-danger",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.render("perfil", {
        mensajeAlert: ["La nueva contraseña y la confirmación no coinciden"],
        alertClass: "alert-danger",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usuario.update({ password: hashedPassword });

    return res.render("perfil", {
      mensajeAlert: ["Contraseña cambiada exitosamente"],
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return res.render("perfil", {
      mensajeAlert: ["Error al cambiar la contraseña"],
      alertClass: "alert-danger",
    });
  }
}

async function cambiarUsuario(req, res) {
  const { newUsuario } = req.body;
  const userId = req.user.id_usuario;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.render("perfil", {
        mensajeAlert: ["Usuario no encontrado"],
        alertClass: "alert-danger",
      });
    }

    // Verificar si el nuevo usuario ya existe
    const existingUser = await Usuario.findOne({
      where: { usuario: newUsuario },
    });
    if (existingUser && existingUser.id_usuario !== userId) {
      return res.render("perfil", {
        mensajeAlert: ["El nombre de usuario ya está en uso"],
        alertClass: "alert-danger",
      });
    }

    await usuario.update({ usuario: newUsuario });

    // Actualizar la sesión
    req.session.usuario = newUsuario;
    req.user.usuario = newUsuario;

    return res.render("perfil", {
      mensajeAlert: ["Nombre de usuario cambiado exitosamente"],
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error("Error al cambiar usuario:", error);
    return res.render("perfil", {
      mensajeAlert: ["Error al cambiar el nombre de usuario"],
      alertClass: "alert-danger",
    });
  }
}

module.exports = {
  renderPerfil,
  cambiarPassword,
  cambiarUsuario,
};
