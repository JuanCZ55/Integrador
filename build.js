const sequelize = require("./models/db");
require("./models/init");

//crear las tablas
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Tablas creadas exitosamente");
    process.exit();
  })
  .catch((err) => {
    console.error("Error al crear tablas:", err);
  });
