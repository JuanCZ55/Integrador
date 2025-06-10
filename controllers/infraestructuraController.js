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
    const habitaciones = await Habitacion.findAll({
      where: {
        id_sector: id_sector,
        [Op.or]: [{ genero: null }, { genero: genero }],
      },
      include: [
        {
          model: Cama,
          as: "camas",
          where: { estado: 1 },
          attributes: ["id_cama"],
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
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// GET /api/apiCamasLibresxHabitacion?id_habitacion=X
async function apiCamasLibres(req, res) {
  const { id_habitacion } = req.query;

  try {
    const camas = await Cama.findAll({
      where: {
        id_habitacion: id_habitacion,
        estado: 1,
      },
    });

    return res.status(200).json(camas);
  } catch (error) {
    return res.status(500).json({ error: "Error al cargar camas libres" });
  }
}
async function listaCamas(req, res) {
  try {
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
              where: { estado: 1 },
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
