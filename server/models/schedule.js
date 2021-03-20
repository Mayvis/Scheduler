"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedule.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(64)
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING(255)
      },
      enable: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      time: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      interval: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      day_of_week: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      color: {
        allowNull: false,
        type: DataTypes.STRING(64)
      },
      file_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          model: "file",
          key: "id"
        }
      },
      group_id_list: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      period: {
        allowNull: false,
        type: DataTypes.BOOLEAN
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
      tableName: "schedule",
      modelName: "Schedule"
    }
  );
  return Schedule;
};