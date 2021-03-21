"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate({ Schedule }) {
      this.belongsTo(Schedule, { foreignKey: "id", as: "schedule" });
    }
  }
  File.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      file_path: {
        allowNull: false,
        type: DataTypes.STRING(255),
        defaultValue: "",
        validate: {
          notNull: { msg: "File must have a file path." },
          notEmpty: { msg: "File path must not be empty." },
          len: [1, 255]
        }
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {
      sequelize,
      timestamps: false, // remove createdAt, updatedAt table column
      tableName: "files",
      modelName: "File"
    }
  );
  return File;
};
