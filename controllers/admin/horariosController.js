const {
  Persona,
  Medico,
  Enfermero,
  Horario,
  Empleado,
  Especialidad,
  Rol,
  Usuario,
} = require("../../models/init");
const sequelize = require("../../models/db"); // transacciones

async function getHorarios(req, res) {
  const dni = req.query.dni;
  if (dni === undefined || dni == "" || dni === null) {
    return res.render("admin/horariosEmpleado");
  }
  try {
    const persona = await Persona.findOne({
      where: { dni },
      include: {
        model: Empleado,
        as: "empleado",
        include: {
          model: Medico,
          as: "medico",
          include: {
            model: Horario,
            as: "horarios",
          },
        },
      },
    });
    // 1. Si no existe la persona
    if (!persona) {
      return res.render("admin/horariosEmpleado", {
        dni,
        mensajeAlert: "No se encontró una persona con ese DNI",
        alertClass: "alert-warning",
      });
    }

    // 2. Si la persona no tiene empleado
    if (!persona.empleado) {
      return res.render("admin/horariosEmpleado", {
        dni,
        mensajeAlert: "Esa persona no está registrada como empleado",
        alertClass: "alert-warning",
      });
    }

    // 3. Si el empleado no es rol 3 (medico)
    if (persona.empleado.id_rol !== 3) {
      return res.render("admin/horariosEmpleado", {
        dni,
        mensajeAlert: "Ese DNI no le pertenece a un médico",
        alertClass: "alert-warning",
      });
    }
    return res.render("admin/horariosEmpleado", { persona });
  } catch (error) {
    console.error("Error al getear los horarios:", error);
    return res.render("admin/horariosEmpleado", {
      mensajeAlert: ["Error al getear los horarios"],
      alertClass: "alert-danger",
    });
  }
}
async function postHorarios(req, res) {
  const {
    id_medico,
    time_eL,
    time_sL,
    time_eM,
    time_sM,
    time_eX,
    time_sX,
    time_eJ,
    time_sJ,
    time_eV,
    time_sV,
    time_eS,
    time_sS,
    time_eD,
    time_sD,
  } = req.body;

  if (!id_medico)
    return res.render("admin/horariosEmpleado", {
      mensajeAlert: "Falta id_medico, busquelo por dni",
      alertClass: "alert-danger",
    });

  try {
    const medico = await Medico.findByPk(id_medico, {
      attributes: ["id_medico"],
      include: {
        model: Empleado,
        as: "empleado",
        attributes: ["id_empleado"],
        include: {
          model: Persona,
          as: "persona",
          attributes: ["dni"],
        },
      },
    });
    if (!medico) {
      return res.render("admin/horariosEmpleado", {
        mensajeAlert: "Médico no encontrado",
        alertClass: "alert-danger",
      });
    }
    const transaction = await sequelize.transaction();
    await Horario.destroy({ where: { id_medico }, transaction });

    const dias = [
      { dia: "Lunes", hora_inicio: time_eL, hora_fin: time_sL },
      { dia: "Martes", hora_inicio: time_eM, hora_fin: time_sM },
      { dia: "Miercoles", hora_inicio: time_eX, hora_fin: time_sX },
      { dia: "Jueves", hora_inicio: time_eJ, hora_fin: time_sJ },
      { dia: "Viernes", hora_inicio: time_eV, hora_fin: time_sV },
      { dia: "Sábado", hora_inicio: time_eS, hora_fin: time_sS },
      { dia: "Domingo", hora_inicio: time_eD, hora_fin: time_sD },
    ];

    for (const d of dias) {
      if (d.hora_inicio && d.hora_fin) {
        await Horario.create(
          {
            id_medico,
            dia: d.dia,
            hora_inicio: d.hora_inicio,
            hora_fin: d.hora_fin,
          },
          transaction
        );
      }
    }

    await transaction.commit();
    res.render("admin/horariosEmpleado", {
      mensajeAlert: "Horarios guardados con éxito",
      alertClass: "alert-success",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al guardar horarios:", error);
    res.render("admin/horariosEmpleado", {
      mensajeAlert: ["Error al guardar los horarios"],
      alertClass: "alert-danger",
    });
  }
}

module.exports = {
  getHorarios,
  postHorarios,
};
