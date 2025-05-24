const sequelize = require('./models/db');
const initModels = require('./models/init-models');

const models = initModels(sequelize);
//crear las tablas
sequelize.sync({ force: true })
  .then(() => {
    console.log('Tablas creadas exitosamente');
    process.exit();
  })
  .catch((err) => {
    console.error('Error al crear tablas:', err);
  });
