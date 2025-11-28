const express = require("express");
const router = express.Router();
const enfermeriaController = require("../controllers/enfermeria/enfermeriaController");
const evaluacionController = require("../controllers/enfermeria/evaluacionController");
//const historiaController = require("../controllers/enfermeria/historiaController");
//const medicacionController = require("../controllers/enfermeria/medicacionController");

router.get("/", (req, res) => {
  res.render("enfermeria/inicio");
});

router.get("/inicio", (req, res) => {
  res.render("enfermeria/inicio");
});

router.get("/pacientes", enfermeriaController.getPacientes);

router.get("/evaluacion", evaluacionController.getEvaluacion);
router.post("/evaluacion", evaluacionController.postEvaluacion);

// router.get("/medicacion", medicacionController.renderMedicacion);
// router.post("/medicacion", medicacionController.postMedicacion);

// router.get("/historia", historiaController.renderHistoria);
// router.post("/historia", historiaController.postHistoria);

module.exports = router;
