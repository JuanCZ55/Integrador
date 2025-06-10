const express = require("express");
const router = express.Router();
const admisionController = require("../controllers/admisionController");
const infraestructuraController = require("../controllers/infraestructuraController");
const pacienteC = require("../controllers/pacienteC");

//+PacienteNuevo--------------------------------------
//*form para crear un paciente/modificarlo
router.get("/crearPaciente", pacienteC.gCrearPaciente);
//* controla el paciente y/o lo crea/modifica
router.post("/crearPaciente", pacienteC.pCrearPaciente);
//*controla para la modificacion de un paciente
router.post("/modificarPaciente", pacienteC.pModificarPaciente);
//*listar pacientes
router.get("/listarPacientes", pacienteC.listarPacientes);

//*api de busqueda
//*Api de busqeda
//router.get("/api/busqueda", pacienteController.busqueda);
router.get("/api/busqueda", pacienteC.busquedaApi);
router.get("/listaTurnos", pacienteC.listaTurnos);
//+Admision----------------------------------------
//*emergencia
router.post("/emergencia", admisionController.emergencia);
//*inicio de admision
//?cambiar "" por "/inicio"
router.get("", admisionController.inicio);
//**renderiza la vista de admision
router.get("/gestionarAdmision", admisionController.admision);
//**crea la admision */
router.post("/gestionarAdmision", admisionController.pAdmision);
//*Lista de admisiones
router.get("/listaAdmision", admisionController.listaAdmisiones);
//*Cancelar admision
router.post("/cancelarAdmision", admisionController.cancelarAdmision);
//*cambiar paciente de admision
router.get(
  "/cambiarPacienteAdmisiones",
  admisionController.cambiarPacienteAdmisiones
);
router.post(
  "/cambiarPacienteAdmisiones",
  admisionController.cambiarPacienteAdmisiones
);

//+Infrestructura--------------------------------------
router.get("/listaCamas", infraestructuraController.listaCamas);
router.get(
  "/api/habitaciones",
  infraestructuraController.apiHabitacionesLibres
);

router.get("/api/camas", infraestructuraController.apiCamasLibres);

module.exports = router;
