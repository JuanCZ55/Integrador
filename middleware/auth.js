const bcrypt = require("bcrypt");
const { Usuario } = require("../models/init");

// Middleware para verificar si el usuario está autenticado
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// Middleware para verificar credenciales de login
const authenticateUser = async (req, res, next) => {
  try {
    const { dni, password } = req.body;

    // Validar que se proporcionaron credenciales
    if (!dni || !password) {
      return res.render("login", {
        error: "DNI y contraseña son requeridos",
      });
    }

    // Buscar usuario por DNI
    const usuario = await Usuario.findOne({
      where: { dni: dni },
    });

    if (!usuario) {
      return res.render("login", {
        error: "DNI o contraseña incorrectos",
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.validarPassword(password);

    if (!passwordValida) {
      return res.render("login", {
        error: "DNI o contraseña incorrectos",
      });
    }

    // Login exitoso - guardar información en la sesión
    req.session.userId = usuario.id;
    req.session.dni = usuario.dni;
    req.session.nombre = usuario.nombre;
    req.session.rol = usuario.rol;

    // Continuar al siguiente middleware o ruta
    next();
  } catch (error) {
    console.error("Error en autenticación:", error);
    return res.render("login", {
      error: "Error interno del servidor",
    });
  }
};

// Middleware para obtener información del usuario actual
const getCurrentUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const usuario = await Usuario.findByPk(req.session.userId);
      req.currentUser = usuario;
      res.locals.currentUser = usuario;
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
    }
  }
  next();
};

// Middleware para verificar si el usuario es administrador
const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.rol !== "1") {
    return res.status(403).send("Acceso denegado");
  }
  next();
};

// Función para logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.clearCookie("connect.sid"); // Nombre por defecto de la cookie de sesión
    res.redirect("/login");
  });
};

module.exports = {
  requireAuth,
  authenticateUser,
  getCurrentUser,
  logout,
  requireAdmin,
};
