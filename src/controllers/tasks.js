const { Tasks } = require("../../models");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const Joi = require("joi");

exports.addTask = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      isDone: Joi.boolean().required(),
      date: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0].message,
      });
    }

    const { title, isDone } = req.body;
    const idUser = req.user.id;
    const date = new Date(req.body.date);

    const response = await Tasks.create({
      idUser,
      title,
      date,
      isDone,
    });

    res.send({
      success: true,
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const date = new Date(req.params.date);

    const tasks = await Tasks.findAll({
      where: {
        idUser: req.user.id,
        date: {
          [Op.gte]: date,
          [Op.lte]: new Date(new Date().setDate(date.getDate() + 1)),
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
  try {
    const task = await Tasks.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!task) {
      return res.status(400).send({
        success: false,
        message: "Task not found",
      });
    }

    if (req.user.id !== task.idUser) {
      return res.status(401).send({
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
  try {
    const task = await Tasks.findOne({ where: { id: req.params.id } });

    if (!task) {
      return res.status(400).send({
        success: false,
        message: "Task not found",
      });
    }

    if (req.user.id !== task.idUser) {
      return res.status(401).send({
        success: false,
        message: "Access Denied",
      });
    }

    task.destroy();

    res.send({
      success: true,
      data: req.params.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};
