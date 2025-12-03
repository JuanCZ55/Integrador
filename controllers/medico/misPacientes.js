const {
  Paciente,
  Admision,
  Medico,
  Persona,
  Habitacion,
  Sector,
  MovimientoCama,
  Cama,
} = require("../../models/init");
const { getRoleId } = require("../../helpers/roleHelper");

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

async function getMisPacientes(req, res) {
  try {
    const id_medico = await getRoleId(req);

    const pacientes = await Paciente.findAll({
      include: [
        {
          model: Persona,
          as: "persona",
        },
        {
          model: Admision,
          as: "admisiones",
          where: { id_medico },
          required: true,
          include: [
            {
              model: MovimientoCama,
              as: "movimientosCama",
              where: { estado: 1 },
              include: [
                {
                  model: Cama,
                  as: "cama",
                  include: [
                    {
                      model: Habitacion,
                      as: "habitacion",
                      include: [
                        {
                          model: Sector,
                          as: "sector",
                        },
                      ],
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

    const pacientesMapeados = pacientes.map((paciente) => {
      const movimiento = paciente.admisiones[0]?.movimientosCama[0];
      const sector = movimiento?.cama?.habitacion?.sector?.nombre;
      const habitacion = movimiento?.cama?.habitacion?.numero;
      const cama = movimiento?.cama?.n_cama;
      const lugar =
        sector && habitacion && cama
          ? `${sector} - ${habitacion} - ${cama}`
          : "Sin asignar";

      return {
        lugar,
        nombre: paciente.persona.nombre,
        dni: paciente.persona.dni,
        edad: calcularEdad(paciente.persona.f_nacimiento),
        id_admision: paciente.admisiones[0]?.id_admision,
      };
    });

    res.render("medico/misPacientes", {
      pacientes: pacientesMapeados,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.render("medico/misPacientes", {
      pacientes: [],
      mensajeAlert: ["Error al cargar tus pacientes."],
      alertClass: "alert-danger",
    });
  }
}
module.exports = {
  getMisPacientes,
};
