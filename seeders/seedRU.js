const sequelize = require("../models/db");
const { Rol, Usuario, Persona } = require("../models/init");
const bcrypt = require("bcrypt");

async function seedRolesUsuarios() {
  // 1. Crear roles
  const roles = [
    { id_rol: 1, nombre: "admin" },
    { id_rol: 2, nombre: "admision" },
    { id_rol: 3, nombre: "medico" },
    { id_rol: 4, nombre: "enfermeria" },
  ];
  await Rol.bulkCreate(roles, { ignoreDuplicates: true });

  // 2. Crear personas para los usuarios
  const personas = [
    {
      dni: 10000001,
      nombre: "Admin",
      apellido: "Sistema",
      f_nacimiento: "1990-01-01",
      genero: "Otro",
    },
    {
      dni: 10000002,
      nombre: "Admi",
      apellido: "Admisiones",
      f_nacimiento: "1991-01-01",
      genero: "Otro",
    },
    {
      dni: 10000003,
      nombre: "Medi",
      apellido: "Medico",
      f_nacimiento: "1992-01-01",
      genero: "Otro",
    },
    {
      dni: 10000004,
      nombre: "Enfe",
      apellido: "Enfermeria",
      f_nacimiento: "1993-01-01",
      genero: "Otro",
    },
  ];
  const personasCreadas = await Persona.bulkCreate(
    personas.map((p) => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    { returning: true }
  );

  // 3. Crear usuarios para cada rol
  const passwordHash = await bcrypt.hash("1234", 10);
  const usuarios = [
    {
      usuario: "admin",
      password: passwordHash,
      id_persona: personasCreadas[0].id_persona,
      id_rol: 1,
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      usuario: "admision",
      password: passwordHash,
      id_persona: personasCreadas[1].id_persona,
      id_rol: 2,
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      usuario: "medico",
      password: passwordHash,
      id_persona: personasCreadas[2].id_persona,
      id_rol: 3,
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      usuario: "enfermeria",
      password: passwordHash,
      id_persona: personasCreadas[3].id_persona,
      id_rol: 4,
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await Usuario.bulkCreate(usuarios, { ignoreDuplicates: true });
}

module.exports = seedRolesUsuarios;
