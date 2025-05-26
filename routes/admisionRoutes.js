const express = require("express");
const router = express.Router();
const admisionController = require("../controllers/admisionController");
router.get("", admisionController.inicio);

//form para crear un paciente
router.get("/crearPaciente", admisionController.gcrearPaciente);
// controla el paciente y/o lo crea/modifica
router.post("/crearPaciente", admisionController.controlCrearPaciente);
//da el dni y devuelve el paciente
router.get("/check", admisionController.gcheckPaciente);

router.post("/check", admisionController.checkPaciente);

module.exports = router;
