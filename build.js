const sequelize = require("./models/db");
require("./models/init");
const seedObraSocial = require("./seeders/seedOS");
const seedMotivos = require("./seeders/seedMotivos");
const seedPersonasPacientes = require("./seeders/seedPP");
const seedSectoresHabitacionesCamas = require("./seeders/seedInfra");
const seedTurnos = require("./seeders/seedTurnos");
const seedRolesUsuarios = require("./seeders/seedRU");

//crear las tablas
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Tablas creadas exitosamente");
    return seedRolesUsuarios();
  })
  .then(() => {
    console.log("Roles y usuarios seed ejecutado correctamente");
    return seedObraSocial();
  })
  .then(() => {
    console.log("Obras sociales seed ejecutado correctamente");
    return seedMotivos();
  })
  .then(() => {
    console.log("Motivos seed ejecutado correctamente");
    return seedPersonasPacientes();
  })
  .then(() => {
    console.log("Personas y pacientes seed ejecutado correctamente");
    return seedSectoresHabitacionesCamas();
  })
  .then(() => {
    console.log("Infraestructura seed ejecutado correctamente");
    return seedTurnos();
  })
  .then(() => {
    console.log("Turnos seed ejecutado correctamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error al crear tablas o seed:", err);
    process.exit(1);
  });
