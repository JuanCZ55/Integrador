const sequelize = require("../models/db");

async function seedObraSocial() {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkInsert("obra_sociales", [
    {
      nombre: "Ninguna",
      cuit: 0,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Dosep",
      cuit: 30999149363,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Dospu",
      cuit: 30707070707,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Pami",
      cuit: 30581103616,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Osde",
      cuit: 30679537395,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Swiss Medical",
      cuit: 30707236061,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Medife",
      cuit: 30707708663,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Federada Salud",
      cuit: 30553307320,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Galeno Argentina",
      cuit: 30651748842,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Jerarquicos Salud",
      cuit: 30556676140,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Medicus",
      cuit: 30502766036,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Omint",
      cuit: 30546674143,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Luz y Fuerza",
      cuit: 30555555555,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Osmata",
      cuit: 30546357477,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Osfatun",
      cuit: 30654321986,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Osetya",
      cuit: 30700000014,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: "Opdea",
      cuit: 30700000021,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

module.exports = seedObraSocial;
