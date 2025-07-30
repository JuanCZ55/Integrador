const express = require("express");
const MEController = require("../controllers/admin/MEController");
const router = express.Router();
router.get("/inicio", (req, res) => {
  res.render("admin/inicio");
});
router.get("/empleado", (req, res) => {
  res.render("admin/empleado");
});
//ruta para ME(Medico-Enfermero)
router.get("/medico", MEController.getME);
router.post("/medico", MEController.postME);

router.get("/horariosEmpleado", (req, res) => {
  res.render("admin/horariosEmpleado");
});

router.get("/usuarios", (req, res) => {
  res.render("admin/usuarios");
});

module.exports = router;
