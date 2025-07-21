const sequelize = require("./models/db");
require("./models/init");
const seedObraSocial = require("./seeders/seedOS");
const seedMotivos = require("./seeders/seedMotivos");
const seedPersonasPacientes = require("./seeders/seedPP");
const seedSectoresHabitacionesCamas = require("./seeders/seedInfra");
const seedTurnos = require("./seeders/seedTurnos");
const seedRolesUsuarios = require("./seeders/seedRU");

async function buildDatabase() {
  try {
    // 1. Sincronizar la base de datos (borra y crea las tablas)
    await sequelize.sync({ force: true });
    console.log("Tablas creadas exitosamente.");

    // 2. Ejecutar los seeders en orden
    await seedObraSocial();
    console.log("Obras sociales sembradas correctamente.");

    await seedMotivos();
    console.log("Motivos sembrados correctamente.");

    await seedPersonasPacientes();
    console.log("Personas y pacientes sembrados correctamente.");

    await seedSectoresHabitacionesCamas();
    console.log("Infraestructura sembrada correctamente.");

    await seedRolesUsuarios();
    console.log("Roles y usuarios sembrados correctamente.");

    await seedTurnos();
    console.log("Turnos sembrados correctamente.");

    console.log("\nProceso de sembrado completado exitosamente.");
    process.exit(0);
  } catch (err) {
    console.error("Error durante el proceso de creación o sembrado:", err);
    process.exit(1);
  }
}

// Ejecutar la función principal
buildDatabase();
