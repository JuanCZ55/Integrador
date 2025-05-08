const Paciente = require('../model/Paciente');
const buscarDni = async (dni) => {
  const p = new Paciente({
    dni,
    nombre: "Juan",
    apellido: "Perez",
    fecha_nacimiento: "1990-01-01",
    sexo: "M",
    telefono: "123456789",
    telefono_contacto: "987654321",
    obra_social: "OSDE",
    detalle: "Paciente sin antecedentes relevantes"
  });
  return p;
}