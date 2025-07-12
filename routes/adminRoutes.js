const express = require("express");

const router = express.Router();
router.get("/inicio", (req, res) => {
  res.render("admin/inicio");
});
router.get("/empleado", (req, res) => {
  res.render("admin/empleado");
});
router.get("/medico", (req, res) => {
  res.render("admin/medico");
});
router.get("/horariosEmpleado", (req, res) => {
  res.render("admin/horariosEmpleado");
});

router.get("/usuarios", (req, res) => {
  res.render("admin/usuarios");
});

module.exports = router;
