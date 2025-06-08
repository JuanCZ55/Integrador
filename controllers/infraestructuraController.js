const {
  Cama,
  Habitacion,
  Sector,
  MovimientoCama,
  Admision,
  Paciente,
  Persona,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");

async function crearCama() {}
// GET /api/apiHabitacionesLibres?id_sector=2&genero=m
async function apiHabitacionesLibres(req, res) {
  const { id_sector, genero } = req.query;

  try {
    // Configuración de consulta optimizada
    const habitaciones = await Habitacion.findAll({
      where: {
        id_sector: id_sector,
        [Op.or]: [
          { genero: null }, // Habitaciones sin nadie
          { genero: genero }, // fitro genero
        ],
      },
      include: [
        {
          model: Cama,
          as: "camas",
          where: { estado: 1 },
          attributes: ["id_cama"], // Solo IDs para reducir datos
        },
        {
          model: Sector,
          as: "sector",
          attributes: ["nombre"],
        },
      ],
    });

    return res.status(200).json(habitaciones);
  } catch (error) {
    console.error("Error al buscar habitaciones libres:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// GET /api/apiCamasLibresxHabitacion?id_habitacion=X
async function apiCamasLibres(req, res) {
  const { id_habitacion } = req.query;

  try {
    // Traemos todas las camas de la habitacion con su movimiento actual
    const camas = await Cama.findAll({
      where: {
        id_habitacion: id_habitacion,
        estado: 1,
      },
    });

    return res.status(200).json(camas);
  } catch (error) {
    console.error("Error al cargar camas libres:", error);
    return res.status(500).json({ error: "Error al cargar camas libres" });
  }
}
async function listaCamas(req, res) {
  try {
    // Trae todas las habitaciones con sus camas
    const habitaciones = await Habitacion.findAll({
      include: [
        {
          model: Sector,
          as: "sector",
        },
        {
          model: Cama,
          as: "camas",
          include: [
            {
              model: MovimientoCama,
              as: "movimientosCama",
              where: { estado: 1 }, // Solo movimiento activo (cama ocupada)
              required: false,
              include: [
                {
                  model: Admision,
                  as: "admision",
                  include: [
                    {
                      model: Paciente,
                      as: "paciente",
                      include: [
                        {
                          model: Persona,
                          as: "persona",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["id_sector", "ASC"],
        ["numero", "ASC"],
        [{ model: Cama, as: "camas" }, "n_cama", "ASC"],
      ],
    });

    res.render("admision/listaCamas", { habitaciones });
  } catch (error) {
    console.error("Error al listar camas:", error);
    res.render("admision/listaCamas", {
      habitaciones: [],
      mensajeAlert: "Error al cargar las camas",
      alertClass: "alert-danger",
    });
  }
}
module.exports = {
  crearCama,
  listaCamas,
  apiHabitacionesLibres,
  apiCamasLibres,
};
