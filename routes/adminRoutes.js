const express = require("express");
const MEController = require("../controllers/admin/MEController");
const empleadoController = require("../controllers/admin/empleadoController");
const usuarioController = require("../controllers/admin/usuariosController");
const cambioRolController = require("../controllers/admin/cambioRolController");
const horarioController = require("../controllers/admin/horariosController");
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

router.get("/horarios", horarioController.getHorarios);
router.post("/horarios", horarioController.postHorarios);

//comentario

router.get("/cambioRol", cambioRolController.getCR);
router.post("/cambioRol", cambioRolController.postCR);
router.get("/usuarios", usuarioController.getUser);
router.post("/usuarios", usuarioController.postUser);

module.exports = router;
