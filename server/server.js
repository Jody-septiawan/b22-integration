require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const routers = require('./src/routers');
const {Server} = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
const io = new Server(server);

const { Chat } = require('./models');

const port = 5500;

app.use(express.json());
app.use(cors());
app.use('/api/v1', routers);
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

let interval;

async function getChat() {
  let chats = await Chat.findAll();
  chats = JSON.parse(JSON.stringify(chats));
  io.emit('all chat', chats);
};

io.on('connection', (socket) => {
  console.log('a user connection: ', socket.id);
  interval = setInterval(async () => {
    await getChat();
  }, 5000);

  socket.on('disconnect', () => {
    console.log('user disconnect');
    console.log(interval)
    clearInterval(interval);
  })

  socket.on('chat message', async (data) => {
    console.log('data received from client: ', data);
    const chat = await Chat.create(data);
    io.emit('chat message', chat.message);
  })

  socket.on('todos', () => {
    
    io.emit('donatur list', data)
  })
});


server.listen(port, () => console.log(`Running on port ${port}`));