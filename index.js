const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.static('public')); 

const users = {};

io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    socket.on('new-user-joined', name => {
        console.log('New user joined:', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on("send", (message) => {
        socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            socket.broadcast.emit('user-left', name);
            delete users[socket.id];
        }
    });
});

server.listen(8000, () => {
    console.log('Server started on port 8000');
});
