const express = require("express");
const MEController = require("../controllers/admin/MEController");
const empleadoController = require("../controllers/admin/empleadoController");
const usuarioController = require("../controllers/admin/usuariosController");
const router = express.Router();
router.get("/inicio", (req, res) => {
  res.render("admin/inicio");
});
//ruta para empleado de AA(Adminstacion-Admision)
router.get("/empleado", empleadoController.getAA);
router.post("/empleado", empleadoController.postAdA);

//ruta para ME(Medico-Enfermero)
router.get("/medico", MEController.getME);
router.post("/medico", MEController.postME);

router.get("/horariosEmpleado", (req, res) => {
  res.render("admin/horariosEmpleado");
});

router.get("/usuarios", usuarioController.getUser);

module.exports = router;
