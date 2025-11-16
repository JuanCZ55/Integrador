const { Sector, Habitacion, Cama } = require("../../models/init");

// Funciones para Sector
function renderSector(res, { nombre, mensajeAlert = [], alertClass = "" }) {
  return res.render("admin/gestionSector", {
    nombre,
    mensajeAlert,
    alertClass,
  });
}

async function getSector(req, res) {
  const nombre = req.query.nombre;
  if (nombre === undefined) {
    return renderSector(res, {});
  }
  try {
    const sector = await Sector.findOne({
      where: { nombre },
    });
    if (!sector) {
      return renderSector(res, {
        nombre,
        mensajeAlert: ["Sector no encontrado."],
        alertClass: "alert-warning",
      });
    }
    return renderSector(res, {
      nombre: sector.nombre,
    });
  } catch (error) {
    console.error("Error en getSector", error);
    return renderSector(res, {
      mensajeAlert: ["Error al buscar el sector."],
      alertClass: "alert-warning",
    });
  }
}

async function postSector(req, res) {
  const { nombre } = req.body;
  if (!nombre || nombre.trim().length === 0) {
    return renderSector(res, {
      nombre,
      mensajeAlert: ["El campo nombre es obligatorio."],
      alertClass: "alert-danger",
    });
  }
  try {
    const [sector, created] = await Sector.upsert({
      nombre: nombre.trim(),
    });
    const mensaje = created
      ? "Sector creado exitosamente."
      : "Sector actualizado exitosamente.";
    return renderSector(res, {
      mensajeAlert: [mensaje],
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error("Error en postSector", error);
    return renderSector(res, {
      nombre,
      mensajeAlert: ["Error al guardar el sector."],
      alertClass: "alert-danger",
    });
  }
}

async function tablaSector(req, res) {
  try {
    const sectores = await Sector.findAll();
    const sectoresData = sectores.map((s) => ({
      id_sector: s.id_sector,
      nombre: s.nombre,
    }));
    return res.render("admin/tablaSector", {
      sectores: sectoresData,
    });
  } catch (error) {
    console.error("Error al obtener sectores:", error);
    return res.render("admin/tablaSector", {
      sectores: [],
      mensajeAlert: ["Error al obtener sectores"],
      alertClass: "alert-danger",
    });
  }
}

// Funciones para Habitacion
function renderHabitacion(
  res,
  {
    id_habitacion,
    id_sector,
    numero,
    capacidad,
    genero,
    mensajeAlert = [],
    alertClass = "",
  }
) {
  return res.render("admin/gestionHabitacion", {
    id_habitacion,
    id_sector,
    numero,
    capacidad,
    genero,
    mensajeAlert,
    alertClass,
  });
}

async function getHabitacion(req, res) {
  const id_habitacion = req.query.id_habitacion;
  const id_sector = req.query.id_sector;
  if (id_habitacion === undefined && id_sector === undefined) {
    return renderHabitacion(res, {});
  }
  if (id_habitacion) {
    try {
      const habitacion = await Habitacion.findByPk(id_habitacion);
      if (!habitacion) {
        return renderHabitacion(res, {
          id_habitacion,
          mensajeAlert: ["Habitación no encontrada."],
          alertClass: "alert-warning",
        });
      }
      return renderHabitacion(res, {
        id_habitacion: habitacion.id_habitacion,
        id_sector: habitacion.id_sector,
        numero: habitacion.numero,
        capacidad: habitacion.capacidad,
        genero: habitacion.genero,
      });
    } catch (error) {
      console.error("Error en getHabitacion", error);
      return renderHabitacion(res, {
        mensajeAlert: ["Error al buscar la habitación."],
        alertClass: "alert-warning",
      });
    }
  } else if (id_sector) {
    // Para agregar nueva habitación en un sector
    return renderHabitacion(res, {
      id_sector: parseInt(id_sector),
    });
  }
}

async function postHabitacion(req, res) {
  const { id_habitacion, id_sector, numero, capacidad, genero } = req.body;
  const errores = [];
  if (!id_sector || !numero || !capacidad) {
    errores.push("Los campos id_sector, numero y capacidad son obligatorios.");
  }
  if (errores.length > 0) {
    return renderHabitacion(res, {
      id_habitacion,
      id_sector,
      numero,
      capacidad,
      genero,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  try {
    const [habitacion, created] = await Habitacion.upsert({
      id_habitacion: id_habitacion ? parseInt(id_habitacion) : undefined,
      id_sector: parseInt(id_sector),
      numero: parseInt(numero),
      capacidad: parseInt(capacidad),
      genero,
    });
    const mensaje = created
      ? "Habitación creada exitosamente."
      : "Habitación actualizada exitosamente.";
    return renderHabitacion(res, {
      mensajeAlert: [mensaje],
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error("Error en postHabitacion", error);
    return renderHabitacion(res, {
      id_habitacion,
      id_sector,
      numero,
      capacidad,
      genero,
      mensajeAlert: ["Error al guardar la habitación."],
      alertClass: "alert-danger",
    });
  }
}

async function tablaHabitacion(req, res) {
  try {
    const habitaciones = await Habitacion.findAll({
      include: {
        model: Sector,
        as: "sector",
        attributes: ["nombre"],
      },
    });
    const habitacionesData = habitaciones.map((h) => ({
      id_habitacion: h.id_habitacion,
      sector: h.sector?.nombre || "",
      numero: h.numero,
      capacidad: h.capacidad,
      genero: h.genero,
    }));
    return res.render("admin/tablaHabitacion", {
      habitaciones: habitacionesData,
    });
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    return res.render("admin/tablaHabitacion", {
      habitaciones: [],
      mensajeAlert: ["Error al obtener habitaciones"],
      alertClass: "alert-danger",
    });
  }
}

// Funciones para Cama
function renderCama(
  res,
  { id_cama, id_habitacion, n_cama, estado, mensajeAlert = [], alertClass = "" }
) {
  return res.render("admin/gestionCama", {
    id_cama,
    id_habitacion,
    n_cama,
    estado,
    mensajeAlert,
    alertClass,
  });
}

async function getCama(req, res) {
  const id_cama = req.query.id_cama;
  const id_habitacion = req.query.id_habitacion;
  if (id_cama === undefined && id_habitacion === undefined) {
    return renderCama(res, {});
  }
  if (id_cama) {
    try {
      const cama = await Cama.findByPk(id_cama);
      if (!cama) {
        return renderCama(res, {
          id_cama,
          mensajeAlert: ["Cama no encontrada."],
          alertClass: "alert-warning",
        });
      }
      return renderCama(res, {
        id_cama: cama.id_cama,
        id_habitacion: cama.id_habitacion,
        n_cama: cama.n_cama,
        estado: cama.estado,
      });
    } catch (error) {
      console.error("Error en getCama", error);
      return renderCama(res, {
        mensajeAlert: ["Error al buscar la cama."],
        alertClass: "alert-warning",
      });
    }
  } else if (id_habitacion) {
    // Para agregar nueva cama en una habitación
    return renderCama(res, {
      id_habitacion: parseInt(id_habitacion),
    });
  }
}

async function postCama(req, res) {
  const { id_cama, id_habitacion, n_cama, estado } = req.body;
  const errores = [];
  if (!id_habitacion || !n_cama || !estado) {
    errores.push("Los campos id_habitacion, n_cama y estado son obligatorios.");
  }
  if (errores.length > 0) {
    return renderCama(res, {
      id_cama,
      id_habitacion,
      n_cama,
      estado,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  try {
    const [cama, created] = await Cama.upsert({
      id_cama: id_cama ? parseInt(id_cama) : undefined,
      id_habitacion: parseInt(id_habitacion),
      n_cama: parseInt(n_cama),
      estado: parseInt(estado),
    });
    const mensaje = created
      ? "Cama creada exitosamente."
      : "Cama actualizada exitosamente.";
    return renderCama(res, {
      mensajeAlert: [mensaje],
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error("Error en postCama", error);
    return renderCama(res, {
      id_cama,
      id_habitacion,
      n_cama,
      estado,
      mensajeAlert: ["Error al guardar la cama."],
      alertClass: "alert-danger",
    });
  }
}

async function tablaCama(req, res) {
  try {
    const camas = await Cama.findAll({
      include: {
        model: Habitacion,
        as: "habitacion",
        attributes: ["numero"],
        include: {
          model: Sector,
          as: "sector",
          attributes: ["nombre"],
        },
      },
    });
    const camasData = camas.map((c) => ({
      id_cama: c.id_cama,
      habitacion: c.habitacion?.numero || "",
      sector: c.habitacion?.sector?.nombre || "",
      n_cama: c.n_cama,
      estado:
        c.estado === 1
          ? "Disponible"
          : c.estado === 2
          ? "Ocupada"
          : "Mantenimiento",
    }));
    return res.render("admin/tablaCama", {
      camas: camasData,
    });
  } catch (error) {
    console.error("Error al obtener camas:", error);
    return res.render("admin/tablaCama", {
      camas: [],
      mensajeAlert: ["Error al obtener camas"],
      alertClass: "alert-danger",
    });
  }
}

async function deleteSector(req, res) {
  const { nombre } = req.body;
  try {
    await Sector.destroy({ where: { nombre } });
    return res.render("admin/tablaSector", {
      mensajeAlert: ["Sector eliminado exitosamente."],
      alertClass: "alert-success",
      sectores: await Sector.findAll().then((s) =>
        s.map((se) => ({ id_sector: se.id_sector, nombre: se.nombre }))
      ),
    });
  } catch (error) {
    console.error("Error al eliminar sector:", error);
    return res.render("admin/tablaSector", {
      mensajeAlert: ["Error al eliminar sector."],
      alertClass: "alert-danger",
      sectores: await Sector.findAll().then((s) =>
        s.map((se) => ({ id_sector: se.id_sector, nombre: se.nombre }))
      ),
    });
  }
}

async function deleteHabitacion(req, res) {
  const { id_habitacion } = req.body;
  try {
    await Habitacion.destroy({ where: { id_habitacion } });
    return res.render("admin/tablaHabitacion", {
      mensajeAlert: ["Habitación eliminada exitosamente."],
      alertClass: "alert-success",
      habitaciones: await Habitacion.findAll({
        include: { model: Sector, as: "sector", attributes: ["nombre"] },
      }).then((h) =>
        h.map((ha) => ({
          id_habitacion: ha.id_habitacion,
          sector: ha.sector?.nombre || "",
          numero: ha.numero,
          capacidad: ha.capacidad,
          genero: ha.genero,
        }))
      ),
    });
  } catch (error) {
    console.error("Error al eliminar habitación:", error);
    return res.render("admin/tablaHabitacion", {
      mensajeAlert: ["Error al eliminar habitación."],
      alertClass: "alert-danger",
      habitaciones: await Habitacion.findAll({
        include: { model: Sector, as: "sector", attributes: ["nombre"] },
      }).then((h) =>
        h.map((ha) => ({
          id_habitacion: ha.id_habitacion,
          sector: ha.sector?.nombre || "",
          numero: ha.numero,
          capacidad: ha.capacidad,
          genero: ha.genero,
        }))
      ),
    });
  }
}

async function deleteCama(req, res) {
  const { id_cama } = req.body;
  try {
    await Cama.destroy({ where: { id_cama } });
    return res.render("admin/tablaCama", {
      mensajeAlert: ["Cama eliminada exitosamente."],
      alertClass: "alert-success",
      camas: await Cama.findAll({
        include: {
          model: Habitacion,
          as: "habitacion",
          attributes: ["numero"],
          include: { model: Sector, as: "sector", attributes: ["nombre"] },
        },
      }).then((c) =>
        c.map((ca) => ({
          id_cama: ca.id_cama,
          habitacion: ca.habitacion?.numero || "",
          sector: ca.habitacion?.sector?.nombre || "",
          n_cama: ca.n_cama,
          estado:
            ca.estado === 1
              ? "Disponible"
              : ca.estado === 2
              ? "Ocupada"
              : "Mantenimiento",
        }))
      ),
    });
  } catch (error) {
    console.error("Error al eliminar cama:", error);
    return res.render("admin/tablaCama", {
      mensajeAlert: ["Error al eliminar cama."],
      alertClass: "alert-danger",
      camas: await Cama.findAll({
        include: {
          model: Habitacion,
          as: "habitacion",
          attributes: ["numero"],
          include: { model: Sector, as: "sector", attributes: ["nombre"] },
        },
      }).then((c) =>
        c.map((ca) => ({
          id_cama: ca.id_cama,
          habitacion: ca.habitacion?.numero || "",
          sector: ca.habitacion?.sector?.nombre || "",
          n_cama: ca.n_cama,
          estado:
            ca.estado === 1
              ? "Disponible"
              : ca.estado === 2
              ? "Ocupada"
              : "Mantenimiento",
        }))
      ),
    });
  }
}

module.exports = {
  getSector,
  postSector,
  tablaSector,
  deleteSector,
  getHabitacion,
  postHabitacion,
  tablaHabitacion,
  deleteHabitacion,
  getCama,
  postCama,
  tablaCama,
  deleteCama,
};
