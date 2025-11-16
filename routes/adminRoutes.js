const express = require("express");
const MEController = require("../controllers/admin/MEController");
const empleadoController = require("../controllers/admin/empleadoController");
const usuarioController = require("../controllers/admin/usuariosController");
const cambioRolController = require("../controllers/admin/cambioRolController");
const horarioController = require("../controllers/admin/horariosController");
const infraestructuraController = require("../controllers/admin/infraestructuraController");
const router = express.Router();
router.get("/inicio", (req, res) => {
  res.render("admin/inicio");
});
//ruta para empleado de AA(Adminstacion-Admision)
router.get("/empleado", empleadoController.getAA);
router.post("/empleado", empleadoController.postAdA);
router.get("/empleado/tabla", empleadoController.tablaEmpleado);

//ruta para ME(Medico-Enfermero)
router.get("/profesional", MEController.getME);
router.post("/profesional", MEController.postME);
router.get("/profesional/tabla", MEController.tablaProfesional);

router.get("/horarios", horarioController.getHorarios);
router.post("/horarios", horarioController.postHorarios);

//comentario

router.get("/cambioRol", cambioRolController.getCR);
router.post("/cambioRol", cambioRolController.postCR);

router.get("/usuarios", usuarioController.getUser);
router.post("/usuarios", usuarioController.postUser);
router.get("/usuarios/tabla", usuarioController.tablaUsuario);

// Infraestructura
// Sector
router.get("/sector", infraestructuraController.getSector);
router.post("/sector", infraestructuraController.postSector);
router.post("/sector/delete", infraestructuraController.deleteSector);
router.get("/sector/tabla", infraestructuraController.tablaSector);

// Habitacion
router.get("/habitacion", infraestructuraController.getHabitacion);
router.post("/habitacion", infraestructuraController.postHabitacion);
router.post("/habitacion/delete", infraestructuraController.deleteHabitacion);
router.get("/habitacion/tabla", infraestructuraController.tablaHabitacion);

// Cama
router.get("/cama", infraestructuraController.getCama);
router.post("/cama", infraestructuraController.postCama);
router.post("/cama/delete", infraestructuraController.deleteCama);
router.get("/cama/tabla", infraestructuraController.tablaCama);

module.exports = router;
