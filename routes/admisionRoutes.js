const express = require('express');
const admisionController = require('../controller/admisionController');

const router = express.Router();

router.get('/crearPaciente', res.render(''));


// // Ruta para eliminar una admisión
// router.delete('/:id', admisionController.deleteAdmision);

module.exports = router;