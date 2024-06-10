import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { saveMessage } from './db.js';


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:4300",
    methods: ["GET", "POST"]
  }
});
const users = {};
const userIds = {};

io.on('connection', (socket) => {
    console.log('Client connected');
    // When a user connects, store their socket in the users object
    socket.on('userConnected', (userId) => {
      users[userId] = socket;
      userIds[socket.id] = userId;
      console.log(`UserIds: ${JSON.stringify(userIds)}`);
      console.log(`User connected: ${userId}`);  // Log the user's ID when they connect
    });
  
    // When a message is received, send it to the recipient's socket
    socket.on('message', async (message) => {
      console.log(message);
      try {
        // Save the message in the database
        await saveMessage(message);
        console.log(`Message saved to database: ${JSON.stringify(message)}`);
    
        const recipientSocket = users[message.recipientId];
        console.log(`Recipient ID: ${message.recipientId}, Recipient Socket:`, recipientSocket);
        if (recipientSocket) {
          // Use the userIds mapping to set the senderId to the user ID, not the socket ID
          recipientSocket.emit('message', { ...message, senderId: userIds[socket.id] });
          console.log(`Message sent to: ${message.recipientId}`);  // Log the recipient's ID when a message is sent
        } else {
          console.log(`Message received for disconnected user: ${message.recipientId}`);  // Log if a message is received for a disconnected user
        }
    
        // Always emit the message to the sender's socket
        const senderSocket = users[message.senderId];
        if (senderSocket) {
          senderSocket.emit('message', { ...message, senderId: userIds[socket.id] });
        }
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    });
  });

server.listen(3001, () => {
  console.log('listening on 3001');
});