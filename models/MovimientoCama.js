const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class MovimientoCama extends Model {}

MovimientoCama.init(
  {
    id_movimiento_camas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_admision: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admisiones",
        key: "id_admision",
      },
    },
    id_cama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "camas",
        key: "id_cama",
      },
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: activa\r\n2: finalizada",
    },
  },
  {
    sequelize,
    modelName: "MovimientoCama",
    tableName: "movimiento_camas",
    timestamps: true,
  }
);

module.exports = MovimientoCama;
