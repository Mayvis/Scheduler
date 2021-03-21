const { sequelize, Schedule, File } = require("./models");
const express = require("express");
const cors = require("cors");
const PORT = 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/schedule", async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      attributes: {
        exclude: ["file_id", "created_at", "updated_at"]
      },
      include: [File]
    });
    return res.json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/schedule", async (req, res) => {
  const {
    name,
    description,
    enable,
    schedule: time,
    interval,
    dayOfWeek: day_of_week,
    color,
    fileId: file_id,
    groupIdList: group_id_list,
    period
  } = req.body;

  try {
    const schedule = await Schedule.create({
      name,
      description,
      enable,
      time,
      interval,
      day_of_week,
      color,
      file_id,
      group_id_list,
      period
    });
    return res.json(schedule);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server started on ${PORT} port`);
  await sequelize.authenticate();
  console.log("Database Connected");
});
