const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Store connected users
const users = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining
    socket.on('user joined', (username) => {
        users.set(socket.id, username);
        
        // Notify all users that someone joined
        socket.broadcast.emit('user joined', {
            username: username,
            message: `${username} joined the chat`,
            timestamp: new Date().toLocaleTimeString()
        });

        // Send current user count to all users
        io.emit('user count', users.size);
        
        console.log(`${username} joined the chat`);
    });

    // Handle chat messages
    socket.on('chat message', (data) => {
        const username = users.get(socket.id);
        if (username) {
            const messageData = {
                username: username,
                message: data.message,
                timestamp: new Date().toLocaleTimeString()
            };
            
            // Send message to all users including sender
            io.emit('chat message', messageData);
            console.log(`${username}: ${data.message}`);
        }
    });

    // Handle user typing
    socket.on('typing', (data) => {
        const username = users.get(socket.id);
        if (username) {
            socket.broadcast.emit('typing', {
                username: username,
                isTyping: data.isTyping
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        if (username) {
            users.delete(socket.id);
            
            // Notify all users that someone left
            socket.broadcast.emit('user left', {
                username: username,
                message: `${username} left the chat`,
                timestamp: new Date().toLocaleTimeString()
            });

            // Send updated user count to all users
            io.emit('user count', users.size);
            
            console.log(`${username} left the chat`);
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Chat server running on http://localhost:${PORT}`);
});