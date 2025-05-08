class Paciente {
  constructor(dni, nombre, apellido, fecha_nacimiento, sexo, telefono, telefono_contacto, obra_social, detalle) {
    this.dni = dni;
    this.nombre = nombre;
    this.apellido = apellido;
    this.fecha_nacimiento = fecha_nacimiento;
    this.sexo = sexo;
    this.telefono = telefono;
    this.telefono_contacto = telefono_contacto;
    this.obra_social = obra_social;
    this.detalle = detalle;


  }
}
module.exports = Paciente;