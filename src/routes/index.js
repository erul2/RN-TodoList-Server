const express = require("express");

const router = express.Router();

const { login, register } = require("../controllers/auth");
const { getTasks, editTask, deleteTask } = require("../controllers/tasks");
const { auth } = require("../middlewares/auth");

router.post("/login", login);

router.post("/register", register);

router.get("/tasks/:date", auth, getTasks);

router.patch("/task", auth, editTask);

router.delete("/task", auth, deleteTask);

module.exports = router;
