const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class DiagnosticosEpisodio extends Model {}

DiagnosticosEpisodio.init(
  {
    id_diag_episodio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_admision: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    diagnostico: {
      type: DataTypes.TEXT,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_hora: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "DiagnosticosEpisodio",
    tableName: "diagnosticos_episodio",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = DiagnosticosEpisodio;
