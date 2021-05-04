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



// socketIO implementation controllers like
exports.socketGetTodos = async () => {
  let dataTodos = await todos.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  dataTodos = JSON.parse(JSON.stringify(dataTodos));
  return dataTodos.map((todo) => {
    return {
      ...todo,
      screenshot_url: process.env.FILE_PATH + todo.screenshot,
    };
  });
}

exports.socketGetTodo = async (id) => {
  try {
    let dataTodo = await todos.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    dataTodo = JSON.parse(JSON.stringify(dataTodo));
    
    return {
      status: "success",
      data: {
        ...dataTodo,
        screenshot_url: process.env.FILE_PATH + dataTodo.screenshot,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

exports.socketDeleteTodo = async (id) => {
  try {
    const checkTodo = todos.findOne({ where: { id } });

    if (!checkTodo) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    await todos.destroy({ where: { id } });

    return {
      status: "delete success",
      data: { id },
    };
  } catch (error) {
    return{
      status: "failed",
      message: "server error",
    };
  }
}