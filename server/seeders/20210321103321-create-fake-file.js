"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "files",
      [
        {
          file_path: "https://www.youtube.com/watch?v=TiK7QtIHy_Y"
        },
        {
          file_path: "https://www.youtube.com/watch?v=PfGaX8G0f2E"
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("files", null, {});
  }
};
