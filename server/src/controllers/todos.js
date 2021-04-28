const { todos } = require("../../models");

exports.getTodos = async (req, res) => {
  try {
    let dataTodos = await todos.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    dataTodos = JSON.parse(JSON.stringify(dataTodos));
    dataTodos = dataTodos.map((todo) => {
      return {
        ...todo,
        screenshot_url: process.env.FILE_PATH + todo.screenshot,
      };
    });

    console.log(dataTodos);
    res.send({
      status: "success",
      data: {
        todos: dataTodos,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const dataTodos = await todos.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      data: dataTodos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

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

    // let todos = await todos.findAll({
    //     attributes: {
    //         exclude: ["createdAt", "updatedAt"],
    //     }
    // });

    // todos = todos.map(todo => {
    //     return {
    //         ...todo,
    //         screenshot: `${process.env.FILE_PATH + todo.screenshot}`
    //     }
    // })
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

    await todos.update(data, {
      where: {
        id,
      },
    });

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
