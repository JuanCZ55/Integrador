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
const {
  getEvaluacion,
  postEvaluacion,
  postDeleteEvaluacion,
} = require("../controllers/medico/evaluacionController");
const {
  getDiagnostico,
  postDiagnostico,
  postDeleteDiagnostico,
} = require("../controllers/medico/diagnosticoController");
const {
  getEstudios,
  postEstudios,
  postDeleteEstudios,
} = require("../controllers/medico/estudiosController");
const { getAlta, postAlta } = require("../controllers/medico/altaController");
const {
  getHistoria,
  postHistoria,
} = require("../controllers/historialController");
const {
  getEvaluacionEnfermeria,
} = require("../controllers/medico/evaluacionEnfermeriaController");

router.get("/sinAsignar", getSinAsignar);
router.post("/asignarPaciente", postAsignacion);
router.get("/api/medicos", getMedicosByEspecialidad);
router.get("/api/buscarPaciente", buscarPaciente);

router.get("/prescripcion", getPrescripcion);
router.post("/guardarPrescripcion", guardarPrescripcion);
router.post("/modificarPrescripcion", modificarPrescripcion);
router.post("/eliminarPrescripcion", eliminarPrescripcion);

router.get("/misPacientes", getMisPacientes);

router.get("/evaluacion", getEvaluacion);
router.post("/evaluacion", postEvaluacion);
router.post("/evaluacion/delete", postDeleteEvaluacion);

router.get("/diagnostico", getDiagnostico);
router.post("/diagnostico", postDiagnostico);
router.post("/diagnostico/delete", postDeleteDiagnostico);

router.get("/estudios", getEstudios);
router.post("/estudios", postEstudios);
router.post("/estudios/delete", postDeleteEstudios);

router.get("/alta", getAlta);
router.post("/alta", postAlta);

router.get("/historia", getHistoria);
router.post("/historia", postHistoria);

router.get("/evaluacion-enfermeria", getEvaluacionEnfermeria);

router.get("/", (req, res) => {
  res.render("medico/inicio");
});

router.get("/inicio", (req, res) => {
  res.render("medico/inicio");
});

module.exports = router;
