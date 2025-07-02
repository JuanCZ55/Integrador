const express = require("express");
const router = express.Router();
const { authenticateUser, logout } = require("../middleware/auth");

// Función reutilizable para redirigir según el rol
function redirectSwitch(id_rol, res) {
  switch (id_rol) {
    case 1:
      return res.redirect("/admin/inicio");
    case 2:
      return res.redirect("/admision");
    case 3:
      return res.redirect("/medico/inicio");
    case 4:
      return res.redirect("/enfermeria/inicio");
  }
}

router.get("/", (req, res) => res.redirect("/login"));

router.get("/login", (req, res) => {
  if (req.session.userId) {
    return redirectSwitch(req.session.id_rol, res);
  }
  if (req.originalUrl.includes("?1")) {
    return res.render("login", {
      mensajeAlert: ["Primero debes iniciar sesion"],
      alertClass: "alert-warning",
    });
  }
  return res.render("login");
});

router.post("/login", authenticateUser, (req, res) => {
  return redirectSwitch(req.session.id_rol, res);
});

router.get("/logout", logout);

module.exports = router;
