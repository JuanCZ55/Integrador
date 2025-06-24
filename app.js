const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./models/db");
//routes
const admision = require("./routes/admisionRoutes");
// const enfer = require("./routes/enfermeriaRoutes");
// const medico = require("./routes/medicoRoutes");
// const admin = require("./routes/administradorRoutes");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
//enrutador para el inicio
app.get("/", (req, res) => {
  res.render("index");
});

//rutas para los 4 roles
app.use("/admision", admision);
// app.use("/enfermeria", enfer);
// app.use("/medico", medico);
// app.use("/administrador", admin);
//ruta para 404
// app.use((req, res, next) => {
//   res.status(404).render("notfound");
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Conexion exitosa a la base de datos");
//   })
//   .catch((err) => {
//     console.error("No se pudo conectar a la base de datos");
//   });

// module.exports = app;
//-Local

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexion exitosa a la base de datos");
    app.listen(3000, () => {
      console.log("Server corre en el puerto 3000");
    });
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos");
    process.exit(1);
  });
