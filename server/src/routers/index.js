const express = require("express");

const router = express.Router();

const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

const {
    addTodo,
    updateTodo,
    deleteTodo } = require('../controllers/todos');

const { registrasi, login, checkAuth } = require('../controllers/auth');

const { getUsers, updateUser, deleteUser, getUser } = require('../controllers/user');

router.post("/register", registrasi);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.get("/users", auth, getUsers);
router.get("/user/:id", auth, getUser);
router.delete("/user/:id", auth, deleteUser);
router.patch("/user/:id", auth, updateUser);

router.post("/todo", uploadFile("image"), addTodo);
router.patch("/todo/:id",uploadFile("image"), updateTodo);
router.delete("/todo/:id", auth, deleteTodo);

module.exports = router;