const { todos } = require("../../models");

module.exports.respond = (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnect');
    socket.disconnect();
  })

  socket.on('load todos', async () => {
    try {
      let dataTodos = await todos.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      dataTodos = JSON.parse(JSON.stringify(dataTodos));
      dataTodos = {
        ...dataTodos,
        screenshot_url: process.env.FILE_PATH + dataTodos.screenshot,
      },
      socket.emit('todos', todos);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('load todo', async () => {
    try {
      const id = socket.handshake.query.id;
      let todo = await todos.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      todo = JSON.parse(JSON.stringify(todo));
      todo = {
        ...todo,
        screenshot_url: process.env.FILE_PATH + todo.screenshot,
      },
      socket.emit('todo', todo);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('delete todo', async(id) => {
    try {
      const checkTodo = todos.findOne({ where: { id } });

      if (!checkTodo) {
        socket.emit('delete todos', {
          status: "failed",
          message: "Data not found",
        });
      }

    await todos.destroy({ where: { id } });

    socket.emit('delete todos', {
      status: "success",
      data: { id },
    });
    } catch (error) {
      console.log(error)
    }
  })
}