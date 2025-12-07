const {
  Paciente,
  Admision,
  Medico,
  Persona,
  Especialidad,
  MovimientoCama,
  Cama,
  Habitacion,
  Sector,
  Empleado,
} = require("../../models/init");

const getSinAsignar = async (req, res) => {
  try {
    const pacientes = await Admision.findAll({
      where: { id_medico: null },
      include: [
        {
          model: Paciente,
          as: "paciente",
          include: [{ model: Persona, as: "persona" }],
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
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
    });

    const especialidades = await Especialidad.findAll();

    // Formatear pacientes para la vista
    const pacientesFormateados = pacientes.map((admision) => {
      const movimiento =
        admision.movimientosCama && admision.movimientosCama[0];
      const lugar = movimiento
        ? `${movimiento.cama.habitacion.sector.nombre} - Habitacion: ${movimiento.cama.habitacion.numero} - Cama: ${movimiento.cama.n_cama}`
        : "N/A";
      return {
        id_admision: admision.id_admision,
        lugar,
        nombre:
          admision.paciente && admision.paciente.persona
            ? `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`
            : "N/A",
        dni:
          admision.paciente && admision.paciente.persona
            ? admision.paciente.persona.dni
            : "N/A",
        edad:
          admision.paciente &&
          admision.paciente.persona &&
          admision.paciente.persona.f_nacimiento
            ? new Date().getFullYear() -
              new Date(admision.paciente.persona.f_nacimiento).getFullYear()
            : "N/A",
      };
    });

    res.render("medico/sinAsignar", {
      pacientes: pacientesFormateados,
      especialidades,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.render("medico/sinAsignar", {
      pacientes: [],
      especialidades: [],
      mensajeAlert: ["Error al cargar pacientes sin asignar."],
      alertClass: "alert-danger",
    });
  }
};

const getMedicosByEspecialidad = async (req, res) => {
  try {
    const { especialidadId } = req.query;
    const includes = [
      {
        model: Empleado,
        as: "empleado",
        include: [{ model: Persona, as: "persona" }],
      },
    ];

    if (especialidadId && especialidadId !== "undefined") {
      includes.push({
        model: Especialidad,
        as: "especialidades",
        where: { id_especialidad: especialidadId },
        through: { attributes: [] },
      });
    }

    const medicos = await Medico.findAll({
      include: includes,
    });

    const medicosFormateados = medicos.map((medico) => ({
      id: medico.id_medico,
      nombre: `${medico.empleado.persona.nombre} ${medico.empleado.persona.apellido}`,
    }));

    res.json(medicosFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener médicos" });
  }
};

const buscarPaciente = async (req, res) => {
  try {
    const { dni } = req.query;
    const paciente = await Paciente.findOne({
      include: [
        {
          model: Persona,
          as: "persona",
          where: { dni },
        },
        {
          model: Admision,
          as: "admisiones",
          include: [
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
              order: [["createdAt", "DESC"]],
              limit: 1,
            },
          ],
        },
      ],
    });

    if (!paciente || !paciente.admisiones || paciente.admisiones.length === 0) {
      return res.json({
        error: "Paciente no encontrado o sin admisión activa",
      });
    }

    const admision = paciente.admisiones[0];
    const movimiento = admision.movimientosCama && admision.movimientosCama[0];
    const lugar = movimiento
      ? `${movimiento.cama.habitacion.sector.nombre} - Habitacion: ${movimiento.cama.habitacion.numero} - Cama: ${movimiento.cama.n_cama}`
      : "N/A";

    const nombre = paciente.persona
      ? `${paciente.persona.nombre} ${paciente.persona.apellido}`
      : "N/A";
    const edad =
      paciente.persona && paciente.persona.f_nacimiento
        ? new Date().getFullYear() -
          new Date(paciente.persona.f_nacimiento).getFullYear()
        : "N/A";

    res.json({
      id_admision: admision.id_admision,
      lugar,
      nombre,
      dni: paciente.persona ? paciente.persona.dni : "N/A",
      edad,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar paciente" });
  }
};

const postAsignacion = async (req, res) => {
  try {
    const { id_admision, id_medico } = req.body;

    const errores = validarDatos(["id_admision", "id_medico"], {
      id_admision,
      id_medico,
    });
    if (errores.length > 0) {
      return res.redirect(
        "/medico/sinAsignar?mensaje=Complete todos los campos obligatorios (*)&alertClass=alert-danger"
      );
    }

    await Admision.update({ id_medico }, { where: { id_admision } });

    res.redirect(
      "/medico/sinAsignar?mensaje=Operación realizada exitosamente&alertClass=alert-success"
    );
  } catch (error) {
    console.error(error);
    res.redirect(
      "/medico/sinAsignar?mensaje=Error en la operación&alertClass=alert-danger"
    );
  }
};

function validarDatos(camposObligatorios, datos) {
  const errores = [];
  for (const campo of camposObligatorios) {
    if (!datos[campo] || datos[campo].toString().trim() === "") {
      errores.push(`${campo} es obligatorio`);
    }
  }
  return errores;
}

module.exports = {
  getSinAsignar,
  getMedicosByEspecialidad,
  postAsignacion,
  buscarPaciente,
};
