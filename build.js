const sequelize = require("./models/db");
require("./models/init");
const seedObraSocial = require("./seeders/seedOS");
//crear las tablas
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Tablas creadas exitosamente");
    return seedObraSocial(); // retornás la promesa
  })
  .then(() => {
    console.log("Seed ejecutado correctamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error al crear tablas o seed:", err);
    process.exit(1);
  });
