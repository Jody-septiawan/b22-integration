require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const routers = require('./src/routers');
const {Server} = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000" //client domain/url
  }
});
const socketIo = require('./src/socket')(io);


const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/api/v1', routers);
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(__dirname + '/public'))


server.listen(port, () => console.log(`Running on port ${port}`));