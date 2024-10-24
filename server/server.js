const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

let textContent = '';
let lockOwner = null; // Store the ID of the locking user
let lockOwnerName = ''; // Store the locking user's name
const connectedUsers = new Map(); // Store users with their IDs and names

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Handle joining users
    socket.on('join', ({ id, name }) => {
        connectedUsers.set(id, name); // Store user ID and name
        socket.broadcast.emit('userJoined', id); // Notify others

        // Send current text content and lock status to the new user
        socket.emit('updateText', textContent);
        socket.emit('lockStatus', { ownerId: lockOwner, ownerName: lockOwnerName });
    });

    // Handle text updates
    socket.on('textChange', (text, userId) => {
        textContent = text;  // Update the content on the server
        io.emit('updateText', textContent);  // Broadcast updated content to all users

        if (!lockOwner) {
            lockOwner = userId; // Lock for this user
            lockOwnerName = connectedUsers.get(userId); // Get owner's name
            io.emit('lockStatus', { ownerId: lockOwner, ownerName: lockOwnerName });  // Notify all users of the new lock status
        }
    });

      // Handle lock status updates
      socket.on('lockStatus', ({ ownerId, ownerName }) => {
        lockOwner = ownerId;
        lockOwnerName = ownerName;
        io.emit('lockStatusChange', { ownerId: lockOwner, ownerName: lockOwnerName });  // Broadcast updated lock status
    });

    // Handle disconnecting users
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        connectedUsers.forEach((name, id) => {
            if (id === socket.id) {
                connectedUsers.delete(id); // Remove from map
                if (id === lockOwner) {
                    lockOwner = null; // Unlock if owner disconnects
                    lockOwnerName = ''; // Clear owner's name
                    io.emit('lockStatus', { ownerId: null, ownerName: '' });  // Notify others of unlock
                }
                io.emit('userLeft', id);  // Notify others of user leaving
            }
        });
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));