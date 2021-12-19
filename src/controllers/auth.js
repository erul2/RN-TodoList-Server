const { Users } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// controller - Login
exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await Users.findOne({
      where: { email: req.body.email },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email or Password is invalid",
      });
    }

    const { id, fullName, email, password } = userExist;

    const isValid = await bcrypt.compare(req.body.password, password);

    if (!isValid) {
      return res.status(400).send({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    const token = jwt.sign(
      {
        id,
        fullName,
      },
      process.env.TOKEN_KEY
    );

    res.send({
      success: true,
      data: {
        id: userExist.id,
        email: userExist.email,
        fullName: userExist.fullName,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

// controller - register
exports.register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });

  try {
    const userExists = await Users.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ["email"],
    });

    if (userExists)
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });

    const salt = await bcrypt.genSalt(5);
    const hassedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await Users.create({
      ...req.body,
      passwor: hassedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.TOKEN_KEY
    );

    res.send({
      success: true,
      data: {
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};
