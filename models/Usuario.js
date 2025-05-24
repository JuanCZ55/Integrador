const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Usuario extends Model { }

Usuario.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuarios',
}
);

module.exports = Usuario;
