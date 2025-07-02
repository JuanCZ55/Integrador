const bcrypt = require("bcrypt");
const { Usuario } = require("../models/init");

// Middleware para requerir autenticacion
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login?1");
  }
  next();
};

// Middleware para login por usuario y password
const authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("login", {
        mensajeAlert: ["Completa usuario y contraseña"],
        alertClass: "alert-danger",
      });
    }

    const user = await Usuario.findOne({
      where: { usuario: username },
      include: ["rol", "persona"],
    });

    if (!user || !(await user.validarPassword(password))) {
      return res.render("login", {
        mensajeAlert: ["Usuario o contraseña incorrectos"],
        alertClass: "alert-danger",
      });
    }

    // guardo en sesion
    req.session.userId = user.id_usuario;
    req.session.id_rol = user.id_rol;

    next();
  } catch (err) {
    console.error("Error en autenticacion:", err);
    return res.render("login", {
      mensajeAlert: ["Error interno del servidor"],
      alertClass: "alert-danger",
    });
  }
};

// Middleware para exponer usuario actual
const getCurrentUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await Usuario.findByPk(req.session.userId, {
        include: ["rol", "persona"],
      });
      req.user = user;
      res.locals.user = user;
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
    }
  }
  next();
};

// Middleware para requerir un id_rol especifico
const requireRoleId = (idRol) => (req, res, next) => {
  const rol = req.session.id_rol;
  if (!req.session.userId || (rol !== idRol && rol !== 1)) {
    return res.status(403).render("denegado");
  }
  next();
};

// logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesion:", err);
      return res.status(500).send("Error al cerrar sesion");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

module.exports = {
  requireAuth,
  authenticateUser,
  getCurrentUser,
  requireRoleId,
  logout,
};
