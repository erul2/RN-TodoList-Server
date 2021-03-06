const express = require("express");

const router = express.Router();

const { login, register } = require("../controllers/auth");
const {
  getTasks,
  editTask,
  deleteTask,
  addTask,
} = require("../controllers/tasks");
const { auth } = require("../middlewares/auth");

router.post("/login", login);

router.post("/register", register);

router.post("/task", auth, addTask);

router.get("/tasks/:date", auth, getTasks);

router.patch("/task/:id", auth, editTask);

router.delete("/task/:id", auth, deleteTask);

module.exports = router;
