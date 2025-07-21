// seeders/seedTurnos.js
const sequelize = require("../models/db");

async function seedTurnos() {
  const queryInterface = sequelize.getQueryInterface();

  // 1. Crear especialidades
  const especialidades = [
    {
      id_especialidad: 1,
      nombre: "Clinica Medica",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_especialidad: 2,
      nombre: "Cardiologia",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_especialidad: 3,
      nombre: "Pediatria",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await queryInterface.bulkInsert("especialidades", especialidades, {});

  // 2. Crear personas (autoincremental)
  const personasData = [
    {
      dni: 40000001,
      nombre: "Ana",
      apellido: "Garcia",
      f_nacimiento: "1980-01-01",
      genero: "Femenino",
      telefono: 2664000001,
      mail: "ana.garcia@hospital.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      dni: 40000002,
      nombre: "Luis",
      apellido: "Martinez",
      f_nacimiento: "1975-05-10",
      genero: "Masculino",
      telefono: 2664000002,
      mail: "luis.martinez@hospital.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      dni: 40000003,
      nombre: "Sofia",
      apellido: "Lopez",
      f_nacimiento: "1985-03-15",
      genero: "Femenino",
      telefono: 2664000003,
      mail: "sofia.lopez@hospital.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      dni: 40000004,
      nombre: "Carlos",
      apellido: "Perez",
      f_nacimiento: "1990-07-20",
      genero: "Masculino",
      telefono: 2664000004,
      mail: "carlos.perez@hospital.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      dni: 40000005,
      nombre: "Maria",
      apellido: "Fernandez",
      f_nacimiento: "1982-11-30",
      genero: "Femenino",
      telefono: 2664000005,
      mail: "maria.fernandez@hospital.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await queryInterface.bulkInsert("personas", personasData, {});

  // Recuperar ids generados de personas
  const dnIs = personasData.map((p) => p.dni).join(",");
  const personasInserted = await queryInterface.sequelize.query(
    `SELECT id_persona, dni FROM personas WHERE dni IN (${dnIs}) ORDER BY dni ASC`,
    { type: sequelize.QueryTypes.SELECT }
  );

  // 3. Crear empleados (rol médico)
  const empleadosMedicosData = personasInserted.map((p) => ({
    id_persona: p.id_persona,
    id_rol: 3,
    fecha_ingreso: "2020-01-01",
    estado: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await queryInterface.bulkInsert("empleados", empleadosMedicosData, {});

  // Recuperar empleados
  const personaIds = empleadosMedicosData.map((e) => e.id_persona).join(",");
  const empleadosMedicos = await queryInterface.sequelize.query(
    `SELECT id_empleado, id_persona FROM empleados WHERE id_persona IN (${personaIds}) ORDER BY id_persona ASC`,
    { type: sequelize.QueryTypes.SELECT }
  );

  // 4. Crear medicos
  const medicos = empleadosMedicos.map((e, i) => ({
    id_empleado: e.id_empleado,
    nro_licencia: 5001 + i,
    estado: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await queryInterface.bulkInsert("medicos", medicos, {});

  // 5. Relacionar medicos con especialidades
  const medicoEspecialidades = [
    {
      id_medico: 1,
      id_especialidad: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 1,
      id_especialidad: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 2,
      id_especialidad: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 3,
      id_especialidad: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 4,
      id_especialidad: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 5,
      id_especialidad: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await queryInterface.bulkInsert(
    "medico_especialidad",
    medicoEspecialidades,
    {}
  );

  // 6. Crear horarios (asumiendo timestamps en tabla horarios)
  const horarios = [];
  for (let i = 1; i <= 5; i++) {
    horarios.push({
      id_horarios: i,
      id_medico: i,
      dia: "Lunes",
      hora_inicio: "08:00",
      hora_fin: "12:00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    horarios.push({
      id_horarios: i + 5,
      id_medico: i,
      dia: "Martes",
      hora_inicio: "14:00",
      hora_fin: "18:00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await queryInterface.bulkInsert("horarios", horarios, {});

  // 7. Crear horario_turno (sin timestamps)
  const horarioTurnos = [];
  for (let i = 1; i <= 27; i++) {
    const hour = Math.floor((i - 1) / 2) + 8;
    const minutes = (i - 1) % 2 === 0 ? "00" : "30";
    horarioTurnos.push({
      id_horario_turno: i,
      hora: `${hour.toString().padStart(2, "0")}:${minutes}`,
    });
  }
  await queryInterface.bulkInsert("horario_turno", horarioTurnos, {});

  // 8. Crear turnos para pacientes existentes
  const pacientes = await queryInterface.sequelize.query(
    "SELECT id_paciente FROM pacientes ORDER BY id_paciente ASC LIMIT 5",
    { type: sequelize.QueryTypes.SELECT }
  );
  const turnos = pacientes.map((p, i) => ({
    id_paciente: p.id_paciente,
    id_medico: i + 1,
    id_horario_turno: (i % 5) + 1,
    fecha: new Date().toISOString().split("T")[0],
    estado: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await queryInterface.bulkInsert("turnos", turnos, {});
}

module.exports = seedTurnos;
