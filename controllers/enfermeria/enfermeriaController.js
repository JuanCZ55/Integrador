const {
  Admision,
  Paciente,
  Persona,
  Medico,
  Empleado,
  EvaluacionEnfermeria,
  MovimientoCama,
  Cama,
  Habitacion,
  Sector,
} = require("../../models/init");

async function getPacientes(req, res) {
  try {
    const admisiones = await Admision.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Paciente,
          as: "paciente",
          include: [{ model: Persona, as: "persona" }],
        },
        {
          model: Medico,
          as: "medicoResponsable",
          include: [
            {
              model: Empleado,
              as: "empleado",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        },
        {
          model: MovimientoCama,
          as: "movimientosCama",
          where: { estado: 1 },
          required: false,
          include: [
            {
              model: Cama,
              as: "cama",
              include: [
                {
                  model: Habitacion,
                  as: "habitacion",
                  include: [{ model: Sector, as: "sector" }],
                },
              ],
            },
          ],
        },
        {
          model: EvaluacionEnfermeria,
          as: "evolucionesEnfermeria",
          limit: 1,
          order: [["fecha_eval", "DESC"]],
          required: false,
        },
      ],
    });

    // Procesar los datos para la vista
    const pacientes = admisiones.map((admision) => {
      return {
        id_admision: admision.id_admision,
        lugar: admision.movimientosCama[0]
          ? `${admision.movimientosCama[0].cama.habitacion.sector.nombre} - ${admision.movimientosCama[0].cama.habitacion.numero} - Cama ${admision.movimientosCama[0].cama.n_cama}`
          : "Sin asignar",
        dni: admision.paciente?.persona?.dni || "Sin DNI",
        nombre: admision.paciente?.persona
          ? `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`
          : "Sin nombre",
        medicoResponsable: admision.medicoResponsable?.empleado?.persona
          ? `${admision.medicoResponsable.empleado.persona.nombre} ${admision.medicoResponsable.empleado.persona.apellido}`
          : "Sin asignar",
        ultimaEvaluacion: admision.evolucionesEnfermeria[0]?.fecha_eval
          ? admision.evolucionesEnfermeria[0].fecha_eval.toLocaleDateString()
          : "Sin evaluaciones",
      };
    });

    res.render("enfermeria/pacientes", { pacientes });
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).send("Error interno del servidor");
  }
}

module.exports = {
  getPacientes,
};
