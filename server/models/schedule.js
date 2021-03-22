"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate({ File }) {
      this.hasOne(File, { foreignKey: "id", sourceKey: "file_id", as: "file" });
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
        type: DataTypes.STRING(64),
        validate: {
          notNull: { msg: "Schedule must have a name." },
          notEmpty: { msg: "Name must not be empty." }
        }
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING(255),
        defaultValue: ""
      },
      enable: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        validate: {
          notNull: { msg: "Schedule must have a enable." },
          notEmpty: { msg: "Enable must not be empty." }
        }
      },
      time: {
        allowNull: false,
        type: DataTypes.JSONB,
        defaultValue: {},
        validate: {
          notNull: { msg: "Schedule must have a time." },
          notEmpty: { msg: "Time must not be empty." }
        }
      },
      interval: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          notNull: { msg: "Schedule must have a interval." },
          notEmpty: { msg: "Interval must not be empty." },
          isNumeric: { msg: "Interval's type must be a number." }
        }
      },
      day_of_week: {
        allowNull: false,
        type: DataTypes.JSONB,
        defaultValue: [],
        validate: {
          notNull: { msg: "Schedule must have a day of week." },
          notEmpty: { msg: "Day of week must not be empty." },
          isSpecificLength(value) {
            if (value.length === 0) {
              throw new Error("The day of week must need value.");
            }
          }
        }
      },
      color: {
        allowNull: false,
        type: DataTypes.STRING(64),
        validate: {
          notNull: { msg: "Schedule must have a color." },
          notEmpty: { msg: "Schedule's color must not be empty." },
          len: [1, 64]
        }
      },
      file_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          model: "File",
          key: "id"
        },
        validate: {
          notNull: { msg: "Schedule must have associate cloud file." },
          notEmpty: { msg: "Schedule must have associate cloud file." }
        }
      },
      group_id_list: {
        allowNull: false,
        type: DataTypes.JSONB,
        defaultValue: [],
        validate: {
          isSpecificLength(value) {
            if (value.length === 0) {
              throw new Error("The day of week must need value.");
            }
          }
        }
      },
      period: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        validate: {
          notNull: { msg: "Schedule must have period." },
          notEmpty: { msg: "Schedule's period must not be empty." }
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
      tableName: "schedules",
      modelName: "Schedule"
    }
  );
  return Schedule;
};
