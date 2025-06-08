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

  // 2. Crear 5 personas para medicos
  const personasMedicos = [
    {
      id_persona: 1001,
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
      id_persona: 1002,
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
      id_persona: 1003,
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
      id_persona: 1004,
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
      id_persona: 1005,
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
  await queryInterface.bulkInsert("personas", personasMedicos, {});

  // 3. Crear médicos asociados a esas personas
  const medicos = [
    {
      id_medico: 1,
      id_persona: 1001,
      nro_licencia: 5001,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 2,
      id_persona: 1002,
      nro_licencia: 5002,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 3,
      id_persona: 1003,
      nro_licencia: 5003,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 4,
      id_persona: 1004,
      nro_licencia: 5004,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_medico: 5,
      id_persona: 1005,
      nro_licencia: 5005,
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await queryInterface.bulkInsert("medicos", medicos, {});

  // 4. Relacionar medicos con especialidades (MedicoEspecialidad)
  const medicoEspecialidades = [
    {
      id_medico: 1,
      id_especialidad: 1,
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

  // 5. Crear horarios para los medicos
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

  // 6. Crear turnos para pacientes existentes (usa los primeros 5 pacientes)
  const pacientes = await queryInterface.sequelize.query(
    "SELECT id_paciente FROM pacientes ORDER BY id_paciente ASC LIMIT 5",
    { type: sequelize.QueryTypes.SELECT }
  );
  const turnos = [];
  for (let i = 0; i < pacientes.length; i++) {
    turnos.push({
      id_paciente: pacientes[i].id_paciente,
      id_medico: i + 1,
      fecha: new Date().toISOString().split("T")[0],
      hora: "09:00",
      estado: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await queryInterface.bulkInsert("turnos", turnos, {});
}

module.exports = seedTurnos;
