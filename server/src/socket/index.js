const socketTodos =  require('./todos');

const socketIo = (io) => {
  const todosNameSpace = io.of('/todos').on('connection', (socket) => {
    socketTodos.respond(socket);
  })
  
  todosNameSpace.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      const token = socket.handshake.auth.token;
      console.log(token)
      next();
    } else {
      next(new Error('invalid'));
    }
  })
}

module.exports = socketIo;