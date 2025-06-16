const express = require("express");
const router = express.Router();
const admisionController = require("../controllers/admisionController");
const infraestructuraController = require("../controllers/infraestructuraController");
const pacienteC = require("../controllers/pacienteC");
const turnosController = require("../controllers/turnosController");

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
//router.get("/api/busqueda", pacienteController.busqueda);a
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
  admisionController.gCambiarPacienteAdmisiones
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

//+Turnos--------------------------------------------------
// Mostrar formulario y buscar por DNI
router.get("/turno", turnosController.getTurnos);

// Crear turno
router.post("/crear", turnosController.postTurnos);

// Modificar turno
router.post("/modificar", turnosController.postModificarTurno);

//fianlizar turno
router.post("/finalizarTurno", turnosController.finalizarTurno);

//cancelar turno
router.post("/cancelarTurno", turnosController.cancelarTurno);

// Buscar horarios disponibles (API)
router.get("/api/horarios", turnosController.apiHorarios);

module.exports = router;
