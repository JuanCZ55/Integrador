const express = require("express");
const router = express.Router();
const admisionController = require("../controllers/admisionController");
const pacienteController = require("../controllers/pacienteController");
const infraestructuraController = require("../controllers/infraestructuraController");

//+Paciente--------------------------------------
//*form para crear un paciente/modificarlo
router.get("/crearPaciente", pacienteController.gcrearPaciente);
//* controla el paciente y/o lo crea/modifica
router.post("/crearPaciente", pacienteController.controlCrearPaciente);
//*controla para la modificacion de un paciente
router.post("/modificarPaciente", pacienteController.modificarPaciente);

//*rederiza la vista para checkear un dni
//-se usa antes de redirrecionar:Gestion,Busqueda,Admision,Modificacion,BuscarCama
router.get("/check", pacienteController.gcheckPaciente);
//*checkea el dni y redirige a la vista correspondiente
router.post("/check", pacienteController.pCheckPaciente);
//*busca y muestra un paciente
router.get("/buscarPaciente", pacienteController.busqueda);
//*listar pacientes
router.get("/listarPacientes", pacienteController.listarPacientes);

//+Admision----------------------------------------
//*emergencia
router.post("/emergencia", admisionController.emergencia);
//*inicio de admision
//?cambiar "" por "/inicio"
router.get("", admisionController.inicio);
//**renderiza la vista de admision
router.get("/gestionarAdmision", admisionController.admision);
//**crea la admision y redirige a movimientoCama */
router.post("/gestionarAdmision", admisionController.padmision);

//+Infrestructura--------------------------------------
router.get(
  "/api/habitaciones",
  infraestructuraController.apiHabitacionesLibres
);
router.get("/api/camas", infraestructuraController.apiCamasLibres);

module.exports = router;
