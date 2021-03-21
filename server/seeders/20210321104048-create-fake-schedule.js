"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const files = await queryInterface.sequelize.query("SELECT id from files;");
    await queryInterface.bulkInsert(
      "schedules",
      [
        {
          name: "3:00-4:00",
          description: "yolo world series",
          enable: true,
          time: [
            {
              start: "2021-03-20T19:00:00.000Z",
              end: "2021-03-20T20:00:00.000Z"
            }
          ],
          interval: 3,
          day_of_week: [1, 4],
          color: "#FFB700",
          file_id: files[0][Math.floor(Math.random() * files[0].length)].id,
          group_id_list: [1, 2],
          period: true
        },
        {
          name: "1:00-2:00",
          description: "yolo world series 2",
          enable: true,
          time: [
            {
              start: "2021-03-20T17:00:00.000Z",
              end: "2021-03-20T19:00:00.000Z"
            }
          ],
          interval: 3,
          day_of_week: [3, 5],
          color: "#FFB700",
          file_id: files[0][Math.floor(Math.random() * files[0].length)].id,
          group_id_list: [1, 2],
          period: true
        }
      ],
      {},
      {
        time: { type: new Sequelize.JSONB() },
        day_of_week: { type: new Sequelize.JSONB() },
        group_id_list: { type: new Sequelize.JSONB() }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("schedules", null, {});
  }
};
