const { Tasks } = require("../../models");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

exports.getTasks = async (req, res) => {
  try {
    const date = newDate(req.params.date);

    const tasks = await Tasks.findAll({
      where: {
        idUser: req.user.id,
        date: {
          [Op.gte]: date,
          [Op.lt]: new Date(new Date().setDate(date.getDate() + 1)),
        },
      },
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    res.send({
      success: true,
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

exports.editTask = async (req, res) => {
  const { id } = req.body;
  try {
    const task = Tasks.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (req.user.id !== task.idUser) {
      res.status(401).send({
        success: false,
        message: "Access Denied",
      });
    }

    await task.update({
      ...req.body,
    });

    res.send({
      success: true,
      data: task,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.body;
  try {
    const task = await Tasks.findOne({ where: { id } });

    if (!task) {
      return res.status(400).send({
        success: false,
        message: "Task not found",
      });
    }

    await task.destroy();

    res.send({
      success: true,
      data: { id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};
