const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
router.get("/inicio", (req, res) => {
  res.render("admin/inicio");
});
router.get("/empleado", (req, res) => {
  res.render("admin/empleado");
});
router.get("/medico", adminController.getME);
router.get("/horariosEmpleado", (req, res) => {
  res.render("admin/horariosEmpleado");
});

router.get("/usuarios", (req, res) => {
  res.render("admin/usuarios");
});

module.exports = router;
