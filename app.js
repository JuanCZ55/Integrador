const express = require("express");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./models/db");
const {
  getCurrentUser,
  requireAuth,
  requireRoleId,
} = require("./middleware/auth");

// rutas
const admision = require("./routes/admisionRoutes");
const enfermeria = require("./routes/enfermeriaRoutes");
const medico = require("./routes/medicoRoutes");
const administrador = require("./routes/adminRoutes");
const login = require("./routes/loginRoutes");

const app = express();

// Configuración de sesiones con Sequelize y Postgres en BD
const store = new SequelizeStore({
  db: sequelize,
  tableName: "sesiones",
  checkExpirationInterval: 10 * 60 * 1000, // purga cada 10 minutos
  expiration: 2 * 60 * 60 * 1000 + 300000, // TTL 2 horas y 5minutos
});
store.sync(); // crea la tabla si no existe

app.use(
  session({
    secret: "asi",
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
      sameSite: "lax",
      secure: false, // true si HTTPS
    },
  })
);

// motor de vistas
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
// middleware para obtener el usuario actual
app.use(getCurrentUser);

// rutas principales---------------------------------------------------------
app.use("/", login);
app.use("/admision", requireAuth, requireRoleId(2), admision);
app.use("/enfermeria", requireAuth, requireRoleId(4), enfermeria);
app.use("/medico", requireAuth, requireRoleId(3), medico);
app.use("/admin", requireAuth, requireRoleId(1), administrador);

// 404
app.use((req, res) => res.status(404).render("notfound"));

// conexion e inicio
async function init() {
  try {
    await sequelize.authenticate();
    console.log("conexion exitosa a la base de datos");

    // solo en local
    if (require.main === module) {
      app.listen(3001, () =>
        console.log("servidor corriendo en el puerto http://localhost:3001")
      );
    }
  } catch (err) {
    console.error("no se pudo conectar a la base de datos", err);
    if (require.main === module) process.exit(1);
  }
}

init();

// export para Vercel
module.exports = app;
