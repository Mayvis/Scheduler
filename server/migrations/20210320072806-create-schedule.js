"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(64)
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING(255)
      },
      enable: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      time: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      interval: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      day_of_week: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING(64)
      },
      file_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "file",
          key: "id"
        }
      },
      group_id_list: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      period: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Schedules");
  }
};
