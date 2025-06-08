const sequelize = require("../models/db");

async function seedSectoresHabitacionesCamas() {
  const queryInterface = sequelize.getQueryInterface();

  // Insertar 4 sectores con nombres especificos
  await queryInterface.bulkInsert(
    "sectores",
    [
      {
        id_sector: 1,
        nombre: "Urgencias",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_sector: 2,
        nombre: "Terapia intensiva",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_sector: 3,
        nombre: "Terapia intermedia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_sector: 4,
        nombre: "Clinica medica",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );

  // Generar 5 habitaciones por cada sector
  const habitaciones = [];
  let nextHabId = 1;
  for (let sectorId = 1; sectorId <= 4; sectorId++) {
    for (let numero = 1; numero <= 5; numero++, nextHabId++) {
      habitaciones.push({
        id_habitacion: nextHabId,
        id_sector: sectorId,
        numero,
        capacidad: Math.floor(Math.random() * 2) + 1, // 1 o 2 camas
        genero: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  await queryInterface.bulkInsert("habitaciones", habitaciones, {});

  // Insertar camas segun la capacidad de cada habitacion
  const camas = [];
  let nextCamaId = 1;
  for (const hab of habitaciones) {
    for (let n = 1; n <= hab.capacidad; n++, nextCamaId++) {
      camas.push({
        id_cama: nextCamaId,
        id_habitacion: hab.id_habitacion,
        n_cama: n,
        estado: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  await queryInterface.bulkInsert("camas", camas, {});
}

module.exports = seedSectoresHabitacionesCamas;
