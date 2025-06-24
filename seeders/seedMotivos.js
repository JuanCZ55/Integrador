const sequelize = require("../models/db");

async function seedMotivos() {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.bulkInsert("motivos", [
    {
      nombre: "Emergencia",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Derivado",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Turno",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

module.exports = seedMotivos;
