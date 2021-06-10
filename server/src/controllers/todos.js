const { todos } = require("../../models");


exports.addTodo = async (req, res) => {
  const data = req.body;
  console.log(req.files.image[0]);
  try {
    if (req.files) {
      const todoCreated = await todos.create({
        ...data,
        screenshot: req.files.image[0].filename,
      });
    }

    res.send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const checkTodo = todos.findOne({ where: { id } });

    if (!checkTodo) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    if (req.files) {
      await todos.update({
        ...data,
        screenshot: req.files.image[0].filename,
      }, {
        where: {
          id,
        },
      }
      );
    } else {
      await todos.update(data, {
        where: {
          id,
        },
      });
    }
    res.send({
      status: "update success",
      data: id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;

    const checkTodo = todos.findOne({ where: { id } });

    if (!checkTodo) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    await todos.destroy({ where: { id } });

    res.send({
      status: "delete success",
      data: { id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};