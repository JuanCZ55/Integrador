// db.js
require("dotenv").config();
const pg = require("pg");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectModule: pg,
    timezone: "-03:00",
    logging: false,

    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      preferQueryMode: "simple",
    },
  }
);

module.exports = sequelize;
