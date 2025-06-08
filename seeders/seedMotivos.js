const sequelize = require("../models/db");

async function seedMotivos() {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.bulkInsert(
    "motivos",
    [
      {
        nombre: "Emergencia",
        estado: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Derivado",
        estado: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Turno",
        estado: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
}

module.exports = seedMotivos;
