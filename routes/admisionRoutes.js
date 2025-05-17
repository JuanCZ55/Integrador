const express = require('express');
const router = express.Router();
const admisionController = require('../controller/admisionController');
//form para crear un paciente
router.get('/crearPaciente', admisionController.crearPaciente);
// controla el paciente
router.post('/crearPaciente', admisionController.controlPaciente);
//da el dni y devuelve el paciente
router.get('/verficar/:dni', admisionController.verificarPaciente);

router.get('/paciente/check', admisionController.gcheckPaciente);

router.post('/paciente/check', admisionController.checkPaciente);

// // Ruta para eliminar una admisión
// router.delete('/:id', admisionController.deleteAdmision);

module.exports = router;