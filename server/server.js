require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const routers = require('./src/routers');
const {Server} = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
const fs = require('fs');

// controllers like
const socketTodos =  require('./src/socket/todos');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000" //client domain/url
  }
});

const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/api/v1', routers);
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(__dirname + '/public'))

// implement namespace or endpoint like in http req,res
const todosNameSpace = io.of('/todos').on('connection', (socket) => {
  socketTodos.respond(todosNameSpace, socket);
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
//


server.listen(port, () => console.log(`Running on port ${port}`));