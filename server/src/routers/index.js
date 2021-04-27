const express = require("express");

const router = express.Router();

const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

const {
    getTodos,
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo } = require('../controllers/todos');

const { regitrasi, login, checkAuth } = require('../controllers/auth');

const { getUsers, updateUser, deleteUser, getUser } = require('../controllers/user');

router.post("/register", regitrasi);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.get("/users", auth, getUsers);
router.get("/user/:id", auth, getUser);
router.delete("/user/:id", auth, deleteUser);
router.patch("/user/:id", auth, updateUser);

router.get("/todos", getTodos);
router.get("/todo/:id", getTodo);
router.post("/todo", addTodo);
router.patch("/todo/:id", updateTodo);
router.delete("/todo/:id", deleteTodo);

module.exports = router;