const {
  Paciente,
  ObraSocial,
  Persona,
  Motivos,
  Admision,
  Turno,
  MovimientoCama,
  Cama,
  Sector,
  Habitacion,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

async function inicio(req, res) {
  res.render("admision/inicio");
}
//+post para crear un paciente de emergencia
async function emergencia(req, res) {
  try {
    // 1. Crear persona con datos mínimos (DNI temporal: autoincremental)
    const persona = await Persona.create({
      dni: null, // Se asignará luego del autoincrement
      nombre: "Paciente",
      apellido: "Emergencia",
      f_nacimiento: "2000-01-01",
      genero: "O",
      telefono: null,
      mail: null,
    });

    // 2. Usar el id_persona como DNI temporal y actualizar
    persona.dni = persona.id_persona;
    await persona.save();

    // 3. Crear paciente asociado a esa persona
    const paciente = await Paciente.create({
      id_persona: persona.id_persona,
      contacto: null,
      direccion: "Desconocida",
      id_obra_social: null,
      cod_os: null,
      detalle: "Ingreso por emergencia",
    });

    // 4. Renderizar una vista mostrando el DNI temporal generado
    if (!persona || !paciente) {
      return res.render("admision/inicio", {
        mensajeAlert: "Error al crear paciente de emergencia",
        alertClass: "alert-danger",
      });
    }
    // return res.render("admision/admision", {
    //   tempDni: persona.dni,
    //   mensajeAlert: `Paciente de emergencia creado. Escriba este DNI: ${persona.dni} en la pulsera/frente del paciente.`,
    //   alertClass: "alert-success",
    //   paciente: {
    //     dni: persona.dni,
    //     nombre: persona.nombre,
    //     apellido: persona.apellido,
    //     f_nacimiento: persona.f_nacimiento,
    //     genero: persona.genero,
    //     telefono: persona.telefono,
    //     mail: persona.mail,
    //     contacto: paciente.contacto,
    //     direccion: paciente.direccion,
    //     id_obra_social: paciente.id_obra_social,
    //     cod_os: paciente.cod_os,
    //     detalle: paciente.detalle,
    //   },
    //   emergencia: true,
    //   motivos: motivosArray,
    // });
    return res.redirect(
      "/gestionarAdmision?dni=" + persona.dni + "&emergencia=true"
    );
  } catch (error) {
    console.error("Error al crear paciente de emergencia:", error);
    return res.redirect("/admision/inicio?error=emergencia");
  }
}
//-------------get para admision----------------
//*lo uso para rederizar la vista con un paciente ya creado(normal/emergencia) o sin paciente
async function admision(req, res) {
  console.log("Estoy en admision get");

  const { dni, emergencia } = req.query;
  try {
    // #region  2. Buscar motivos de admisión activos y los ordena
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));
    // #endregion
    let secArray;
    const sectores = await Sector.findAll({});
    if (sectores.length === 0) {
      console.error("No hay sectores disponibles");
    } else {
      secArray = sectores.map((a) => ({
        id_sector: a.id_sector,
        nombre: a.nombre,
      }));
    }

    const admiNula = {
      id_admision: "",
      id_paciente: "",
      id_motivo: "",
      derivado: "",
      fecha_ingreso: "",
      fecha_egreso: "",
      estado: "",
    };
    let mensajeAlert = "";
    const pacienteNulo = {
      dni: "",
      nombre: "",
      apellido: "",
      f_nacimiento: "",
      genero: "",
      telefono: "",
      mail: "",
      contacto: "",
      direccion: "",
      id_obra_social: "",
      cod_os: "",
      detalle: "",
    };
    if (dni) {
      // 1. Buscar persona por DNI
      const persona = await Persona.findOne({
        where: { dni },
        include: [
          {
            model: Paciente,
            as: "paciente",
          },
        ],
      });

      if (!persona || !persona.paciente) {
        mensajeAlert = "El paciente no existe en el sistema";
        return res.render("admision/gestionarAdmision", {
          mensajeAlert: mensajeAlert,
          alertClass: "alert-danger",
          dni: dni,
          paciente: pacienteNulo,
          admision: admiNula,
          sectores: secArray,
          camaSeleccionada: {},
        });
      }
      if (persona) {
        const turno = await Turno.findOne({
          where: {
            id_paciente: persona.paciente.id_paciente,
          },
        });
        const admi = await Admision.findOne({
          where: {
            id_paciente: persona.paciente.id_paciente,
            estado: "1",
          },
        });

        if (emergencia == "true") {
          mensajeAlert = `Paciente de emergencia creado. Escriba este DNI: ${dni} en la pulsera/frente del paciente.`;
        }
        //*si se hizo un adminsion debe tener una cama asignada, entoces la busco
        let camaSelec = null;
        if (admi) {
          camaSelec = await MovimientoCama.findOne({
            where: {
              id_admision: admi.id_admision,
              estado: 1,
            },
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
          });
        } //*Si el paciente esta cargado, lo devuelve
        return res.render("admision/gestionarAdmision", {
          dni: dni,
          mensajeAlert: mensajeAlert || "",
          alertClass: "alert-success",
          paciente: {
            id: persona.paciente.id_paciente,
            dni: persona.dni,
            nombre: persona.nombre,
            apellido: persona.apellido,
            f_nacimiento: persona.f_nacimiento,
            genero: persona.genero,
            telefono: persona.telefono,
            mail: persona.mail,
            contacto: persona.paciente.contacto,
            direccion: persona.paciente.direccion,
            id_obra_social: persona.paciente.id_obra_social,
            cod_os: persona.paciente.cod_os,
            detalle: persona.paciente.detalle,
          },
          emergencia: emergencia || "false",
          motivos: motivosArray,
          admision: admi || admiNula,
          camaSeleccionada: camaSelec ? camaSelec : {},
          f_turno: turno ? turno.fecha : "",
          sectores: secArray,
        });
      }
    }
    //este carga cuando se busca al paciente o no
    return res.render("admision/gestionarAdmision", {
      emergencia: "false",
      motivos: motivosArray,
      admision: admiNula,
      paciente: pacienteNulo,
      dni: dni,
      sectores: secArray,
      camaSeleccionada: {},
    });
  } catch (error) {
    console.error("Error al pedir la admision", error);
    return res.redirect("/admision/inicio?error=admision");
  }
}
//-------------post para crear admision----------------
async function padmision(req, res) {
  console.log("Estoy en admision post");

  const { id_admision, id_paciente, id_motivo, derivado, id_cama, egreso } =
    req.body;
  console.log(id_admision, id_paciente, id_motivo, derivado, id_cama, egreso);

  try {
    // #region  2. Buscar motivos de admisión activos y los ordena
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));
    const persona = await Persona.findOne({
      include: [
        {
          model: Paciente,
          as: "paciente",
          where: { id_paciente: id_paciente },
        },
      ],
    });
    if (!persona) {
      console.error("no existe el paciente");
    }
    // #endregion
    // Validar campos obligatorios id_paciente, id_motivo
    if (!id_paciente || !id_motivo) {
      console.log("Faltan campos obligatorios");
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camaSeleccionada: camaSelec ? camaSelec.id_cama : {},
        paciente: {
          dni: persona.dni,
          nombre: persona.nombre,
          apellido: persona.apellido,
          f_nacimiento: persona.f_nacimiento,
          genero: persona.genero,
          telefono: persona.telefono,
          mail: persona.mail,
          contacto: persona.paciente.contacto,
          direccion: persona.paciente.direccion,
          id_obra_social: persona.paciente.id_obra_social,
          cod_os: persona.paciente.cod_os,
          detalle: persona.paciente.detalle,
        },
      });
    }
    const cama = await Cama.findByPk(id_cama);
    if (id_cama && !cama) {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "La cama seleccionada no existe",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camaSeleccionada: camaSelec ? camaSelec.id_cama : {},
        paciente: {
          dni: persona.dni,
          nombre: persona.nombre,
          apellido: persona.apellido,
          f_nacimiento: persona.f_nacimiento,
          genero: persona.genero,
          telefono: persona.telefono,
          mail: persona.mail,
          contacto: persona.paciente.contacto,
          direccion: persona.paciente.direccion,
          id_obra_social: persona.paciente.id_obra_social,
          cod_os: persona.paciente.cod_os,
          detalle: persona.paciente.detalle,
        },
      });
    }
    //busco los motivos por id_motivo
    const motivo = await Motivos.findByPk(id_motivo);
    // Validar motivo de admisión turno o derivado, emergencia no ocupa
    if (motivo) {
      if (motivo.nombre === "Turno") {
        const turno = await Turno.findOne({
          where: {
            id_paciente: id_paciente,
            fecha: new Date().toISOString().split("T")[0],
          },
        });
        if (!turno) {
          return res.render("admision/gestionarAdmision", {
            mensajeAlert:
              "No hay turnos asosiados de este paciente para la fecha de hoy",
            alertClass: "alert-danger",
            admision: {
              id_admision,
              id_paciente,
              id_motivo,
              derivado,
            },
            motivosArray,
            camaSeleccionada: camaSelec ? camaSelec.id_cama : {},
            paciente: {
              dni: persona.dni,
              nombre: persona.nombre,
              apellido: persona.apellido,
              f_nacimiento: persona.f_nacimiento,
              genero: persona.genero,
              telefono: persona.telefono,
              mail: persona.mail,
              contacto: persona.paciente.contacto,
              direccion: persona.paciente.direccion,
              id_obra_social: persona.paciente.id_obra_social,
              cod_os: persona.paciente.cod_os,
              detalle: persona.paciente.detalle,
            },
          });
        }
      } else if (motivo.nombre === "Derivado") {
        if (!derivado || derivado === "") {
          return res.render("admision/gestionarAdmision", {
            mensajeAlert:
              "Por favor ingrese el nombre del medico/hospital derivado",
            alertClass: "alert-danger",
            admision: {
              id_admision,
              id_paciente,
              id_motivo,
              derivado,
            },
            motivosArray,
            camaSeleccionada: camaSelec ? camaSelec.id_cama : {},
            paciente: {
              dni: persona.dni,
              nombre: persona.nombre,
              apellido: persona.apellido,
              f_nacimiento: persona.f_nacimiento,
              genero: persona.genero,
              telefono: persona.telefono,
              mail: persona.mail,
              contacto: persona.paciente.contacto,
              direccion: persona.paciente.direccion,
              id_obra_social: persona.paciente.id_obra_social,
              cod_os: persona.paciente.cod_os,
              detalle: persona.paciente.detalle,
            },
          });
        }
      }
    } else {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Ingrese un motivo de admisión válido",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camaSeleccionada: camaSelec ? camaSelec.id_cama : {},
        paciente: {
          dni: persona.dni,
          nombre: persona.nombre,
          apellido: persona.apellido,
          f_nacimiento: persona.f_nacimiento,
          genero: persona.genero,
          telefono: persona.telefono,
          mail: persona.mail,
          contacto: persona.paciente.contacto,
          direccion: persona.paciente.direccion,
          id_obra_social: persona.paciente.id_obra_social,
          cod_os: persona.paciente.cod_os,
          detalle: persona.paciente.detalle,
        },
      });
    }

    let admision;
    if (id_admision) {
      admision = await Admision.findByPk(id_admision);
      if (!admision) {
        return res.render("admision/gestionarAdmision", {
          mensajeAlert: "No se encontro la admision a modificar",
          alertClass: "alert-danger",
          admision: {
            id_admision,
            id_paciente,
            id_motivo,
            derivado,
          },
          motivosArray,
          camaSeleccionada: camaSelec ? camaSelec.id_cama : {},
          paciente: {
            dni: persona.dni,
            nombre: persona.nombre,
            apellido: persona.apellido,
            f_nacimiento: persona.f_nacimiento,
            genero: persona.genero,
            telefono: persona.telefono,
            mail: persona.mail,
            contacto: persona.paciente.contacto,
            direccion: persona.paciente.direccion,
            id_obra_social: persona.paciente.id_obra_social,
            cod_os: persona.paciente.cod_os,
            detalle: persona.paciente.detalle,
          },
        });
      }
      admision.id_motivo = id_motivo;
      admision.derivado = derivado || null;
      if (egreso != "") {
        admision.fecha_egreso = egreso;
        admision.estado = 3;
      }
      await admision.save();
      // Actualizar movimiento de cama si corresponde
      if (id_cama) {
        // Buscar movimiento activo
        let mov = await MovimientoCama.findOne({
          where: {
            id_admision: admision.id_admision,
            estado: 1,
          },
        });
        if (mov) {
          mov.id_cama = id_cama;
          await mov.save();
        } else {
          // Si no hay movimiento activo, crear uno nuevo
          await MovimientoCama.create({
            id_admision: admision.id_admision,
            id_cama: id_cama,
          });
        }
      }
    } else {
      // Crear nueva admisión
      admision = await Admision.create({
        id_paciente,
        id_motivo,
        derivado: derivado || null,
        fecha_ingreso: new Date().toISOString().split("T")[0],
      });
      // Crear movimiento de cama si corresponde
      if (id_cama) {
        await MovimientoCama.create({
          id_admision: admision.id_admision,
          id_cama: id_cama,
        });
      }
    }

    return res.redirect("/admision/gestionarAdmision?etapa=crear");
  } catch (error) {
    console.error("Error al crear la admisión de post:", error);
    return res.redirect("/admision/inicio?error=admision");
  }
}
async function postGestionarAdmision(req, res) {
  console.log("Estoy en admision post");

  const {
    id_admision,
    id_paciente,
    id_motivo,
    derivado,
    id_cama,
    egreso,
    egresar, // checkbox para marcar egreso
  } = req.body;

  try {
    // 1) Obtener lista de motivos activos
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));
    let secArray = [];
    try {
      const sectores = await Sector.findAll({});
      secArray = sectores.map((a) => ({
        id_sector: a.id_sector,
        nombre: a.nombre,
      }));
    } catch (error) {
      console.error("Error al obtener sectores:", error);
    }
    // 2) Obtener datos de persona/paciente
    const persona = await Persona.findOne({
      include: [
        {
          model: Paciente,
          as: "paciente",
          where: { id_paciente: id_paciente },
        },
      ],
    });
    if (!persona) {
      console.error("no existe el paciente");
      // Si no hay persona, no podemos continuar
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Paciente no encontrado",
        alertClass: "alert-danger",
        admision: null,
        motivosArray,
        camaSeleccionada: {},
        paciente: {},
        sectores: secArray,
      });
    }

    // Funcion auxiliar para armar objeto comun de render
    const datosRenderComun = (mensajeAlert) => {
      return {
        mensajeAlert,
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camaSeleccionada: id_cama || {},
        paciente: {
          dni: persona.dni,
          nombre: persona.nombre,
          apellido: persona.apellido,
          f_nacimiento: persona.f_nacimiento,
          genero: persona.genero,
          telefono: persona.telefono,
          mail: persona.mail,
          contacto: persona.paciente.contacto,
          direccion: persona.paciente.direccion,
          id_obra_social: persona.paciente.id_obra_social,
          cod_os: persona.paciente.cod_os,
          detalle: persona.paciente.detalle,
        },
        sectores: secArray,
      };
    };

    // 3) Validar campos obligatorios (id_paciente, id_motivo)
    if (!id_paciente || !id_motivo) {
      console.log("Faltan campos obligatorios");
      return res.render(
        "admision/gestionarAdmision",
        datosRenderComun("Por favor llene todos los campos obligatorios")
      );
    }

    // 4) Validar cama seleccionada si existe id_cama
    if (id_cama) {
      const camaObj = await Cama.findByPk(id_cama);
      if (!camaObj) {
        return res.render(
          "admision/gestionarAdmision",
          datosRenderComun("La cama seleccionada no existe")
        );
      }
    }

    // 5) Validar motivo de admision
    const motivo = await Motivos.findByPk(id_motivo);
    if (!motivo) {
      return res.render(
        "admision/gestionarAdmision",
        datosRenderComun("Ingrese un motivo de admision valido")
      );
    }

    if (motivo.nombre === "Turno") {
      const hoy = new Date().toISOString().split("T")[0];
      const turno = await Turno.findOne({
        where: {
          id_paciente: id_paciente,
          fecha: hoy,
        },
      });
      if (!turno) {
        return res.render(
          "admision/gestionarAdmision",
          datosRenderComun(
            "No hay turnos asociados de este paciente para la fecha de hoy"
          )
        );
      }
    } else if (motivo.nombre === "Derivado") {
      if (!derivado || derivado.trim() === "") {
        return res.render(
          "admision/gestionarAdmision",
          datosRenderComun(
            "Por favor ingrese el nombre del medico u hospital derivado"
          )
        );
      }
    }

    // 6) Si existe id_admision, actualizamos. Sino, creamos nueva
    let admision;
    if (id_admision) {
      admision = await Admision.findByPk(id_admision);
      if (!admision) {
        return res.render(
          "admision/gestionarAdmision",
          datosRenderComun("No se encontro la admision a modificar")
        );
      }

      // Actualizar campos generales
      admision.id_motivo = id_motivo;
      admision.derivado = derivado || null;

      // --- Manejo de egreso ---
      if (egresar) {
        // Si checkbox de egreso fue marcado
        if (!egreso) {
          return res.render(
            "admision/gestionarAdmision",
            datosRenderComun("Debe ingresar la fecha de egreso")
          );
        }
        // Validar que egreso >= ingreso
        const fechaIngresoDB = new Date(admision.fecha_ingreso);
        const fechaEgresoInput = new Date(egreso);
        if (fechaEgresoInput < fechaIngresoDB) {
          return res.render(
            "admision/gestionarAdmision",
            datosRenderComun(
              "La fecha de egreso no puede ser anterior a la de ingreso"
            )
          );
        }
        admision.fecha_egreso = egreso;
        admision.estado = 3; // Egresado

        // Liberar cama asociada (todos los movimientos activos)
        await MovimientoCama.update(
          { estado: 0 },
          {
            where: {
              id_admision: admision.id_admision,
              estado: 1,
            },
          }
        );
      } else {
        // Si no se quiere egresar: limpiar fecha y marcar activo
        admision.fecha_egreso = null;
        admision.estado = 1; // Activo
      }
      // --- Fin manejo egreso ---

      await admision.save();

      // Si hay cambio de cama (y no es egreso), creamos/actualizamos movimiento
      if (id_cama && !egresar) {
        // Buscamos movimiento activo
        const movActivo = await MovimientoCama.findOne({
          where: {
            id_admision: admision.id_admision,
            estado: 1,
          },
        });
        if (movActivo) {
          if (movActivo.id_cama !== Number(id_cama)) {
            // Si cambió la cama, actualizamos
            movActivo.id_cama = id_cama;
            await movActivo.save();
          }
        } else {
          // No hay movimiento activo, creamos uno nuevo
          await MovimientoCama.create({
            id_admision: admision.id_admision,
            id_cama: id_cama,
          });
        }
      }
    } else {
      // Crear nueva admision
      admision = await Admision.create({
        id_paciente,
        id_motivo,
        derivado: derivado || null,
        fecha_ingreso: new Date().toISOString().split("T")[0],
        estado: 1, // Activo por defecto
      });
      // Crear movimiento de cama si corresponde
      if (id_cama) {
        await MovimientoCama.create({
          id_admision: admision.id_admision,
          id_cama: id_cama,
        });
      }
    }

    return res.redirect(
      "/admision/gestionarAdmision?id_admision=" + admision.id_admision
    );
  } catch (error) {
    console.error("Error al procesar la admision:", error);
    return res.render("admision/gestionarAdmision", {
      mensajeAlert: "Error interno al procesar la admision",
      alertClass: "alert-danger",
      admision: null,
      motivosArray: [], // Quizas recargar motivosArray antes
      camaSeleccionada: {},
      paciente: {},
    });
  }
}

module.exports = {
  inicio,
  admision,
  padmision,
  emergencia,
  postGestionarAdmision,
};
