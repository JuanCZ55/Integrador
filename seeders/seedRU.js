const sequelize = require("../models/db");
const {
  Rol,
  Usuario,
  Persona,
  Empleado,
  Enfermero,
  Medico,
} = require("../models/init");
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

  // 3. Crear empleados para cada persona y rol
  const empleados = [
    {
      id_persona: 16,
      id_rol: 1,
      fecha_ingreso: "2020-01-01",
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_persona: 17,
      id_rol: 2,
      fecha_ingreso: "2020-01-01",
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_persona: 18,
      id_rol: 3,
      fecha_ingreso: "2020-01-01",
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_persona: 19,
      id_rol: 4,
      fecha_ingreso: "2020-01-01",
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const empleadosCreados = await Empleado.bulkCreate(empleados, {
    returning: true,
  });

  // 4. Crear enfermero y medico
  await Enfermero.create({
    id_empleado: empleadosCreados[3].id_empleado,
    nro_licencia: 6001,
  });
  await Medico.create({
    id_empleado: empleadosCreados[2].id_empleado,
    nro_licencia: 5001,
  });

  // 5. Crear usuarios para cada empleado y rol
  const passwordHash = await bcrypt.hash("1234", 10);
  const usuarios = [
    {
      usuario: "admin",
      password: passwordHash,
      id_empleado: empleadosCreados[0].id_empleado,
      id_rol: 1,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      usuario: "admision",
      password: passwordHash,
      id_empleado: empleadosCreados[1].id_empleado,
      id_rol: 2,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      usuario: "medico",
      password: passwordHash,
      id_empleado: empleadosCreados[2].id_empleado,
      id_rol: 3,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      usuario: "enfermeria",
      password: passwordHash,
      id_empleado: empleadosCreados[3].id_empleado,
      id_rol: 4,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await Usuario.bulkCreate(usuarios, { ignoreDuplicates: true });
}

module.exports = seedRolesUsuarios;
