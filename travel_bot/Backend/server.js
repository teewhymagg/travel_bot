const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(http);
var cors = require('cors')
 
app.use(cors({ origin: 'http://localhost:3000' }));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log('Received message:', message);

    const response = `You sent: ${message}`;

    io.emit('response', { user: 'bot', message: response });

    console.log('Emitted response:', response);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



const port = 3001;
http.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
