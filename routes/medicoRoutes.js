const express = require("express");
const router = express.Router();

const {
  getSinAsignar,
  postAsignacion,
  getMedicosByEspecialidad,
  buscarPaciente,
} = require("../controllers/medico/sinAsingarController");
const {
  getPrescripcion,
  guardarPrescripcion,
  modificarPrescripcion,
  eliminarPrescripcion,
} = require("../controllers/medico/prescripcionController");
const { getMisPacientes } = require("../controllers/medico/misPacientes");

router.get("/sinAsignar", getSinAsignar);
router.post("/asignarPaciente", postAsignacion);
router.get("/api/medicos", getMedicosByEspecialidad);
router.get("/api/buscarPaciente", buscarPaciente);

router.get("/prescripcion", getPrescripcion);
router.post("/guardarPrescripcion", guardarPrescripcion);
router.post("/modificarPrescripcion", modificarPrescripcion);
router.post("/eliminarPrescripcion", eliminarPrescripcion);

router.get("/misPacientes", getMisPacientes);

router.get("/inicio", (req, res) => {
  res.render("medico/inicio");
});

module.exports = router;
