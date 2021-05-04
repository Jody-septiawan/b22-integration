const { todos } = require("../../models");

const { socketGetTodos, socketGetTodo, socketDeleteTodo } = require('../controllers/todos');
module.exports.respond = (endpoint, socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnect');
    socket.disconnect();
  })

  socket.on('load todos', async () => {
    const todos = await socketGetTodos();
    socket.emit('todos', todos);
  });

  socket.on('load todo', async () => {
    try {
      const id = socket.handshake.query.id;
      const todo = await socketGetTodo(id);
      socket.emit('todo', todo);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('delete todo', async(id) => {
    try {
      const response = await socketDeleteTodo(id)
    } catch (error) {
      console.log(error)
    }
  })
}