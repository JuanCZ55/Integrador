const express = require("express");
const router = express.Router();
const enfermeriaController = require("../controllers/enfermeria/enfermeriaController");
const evaluacionController = require("../controllers/enfermeria/evaluacionController");
const historialController = require("../controllers/enfermeria/historialController");
const medicacionController = require("../controllers/enfermeria/medicacionController");

router.get("/", (req, res) => {
  res.render("enfermeria/inicio");
});

router.get("/inicio", (req, res) => {
  res.render("enfermeria/inicio");
});

router.get("/pacientes", enfermeriaController.getPacientes);

router.get("/evaluacion", evaluacionController.getEvaluacion);
router.post("/evaluacion", evaluacionController.postEvaluacion);

router.get("/medicacion", medicacionController.getMedicacion);
router.post("/medicacion", medicacionController.postMedicacion);
router.post("/medicacion/delete", medicacionController.deleteMedicacion);

router.get("/historial", historialController.getHistoria);
router.post("/historial", historialController.postHistoria);

module.exports = router;
