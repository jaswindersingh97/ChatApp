// socket.js
const { Server } = require('socket.io');

const User = require('./../models/User');  // Import your User model

const socketSetup = (server) => {
  const io = new Server(server, {
    pingTimeout:60000,
    cors: {
      origin: "http://localhost:5173", // Adjust this to your front-end URL
      methods: ["GET", "POST"]
    }
  });

  const activeUsers = new Map();  
  
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Listen for 'userConnected' event and store userId with socketId 
    socket.on('userConnected', async({ userId }) => {
      console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
      // Store userId and socketId in a map or database for tracking user online status

      // Update the user's status to active
      await User.findByIdAndUpdate(userId, { isActive: true });

      // Optionally, store the active user in an in-memory map or similar structure
      activeUsers.set(socket.id, userId);
    });

    // Handling user joining a room
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    });
    // handle send message
    socket.on('sendMessage', ({ roomId, message }) => {
      const userId = users[socket.id]; // Get user ID from the socket ID
      console.log(`Message from user ${userId}: ${message}`);
      
      // Emit the message to the room
      io.to(roomId).emit('receiveMessage', { message, senderId: userId });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      const userId = activeUsers.get(socket.id);  // Get the userId based on socket.id
      if (userId) {
        console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);

        // Update user's status to inactive and store the last active time
        await User.findByIdAndUpdate(userId, {
          isActive: false,
          lastActive: new Date()  // Store the current timestamp as lastActive
        });

        // Remove the user from the active users map
        activeUsers.delete(socket.id);
      }

    });
  
  });
};

module.exports = socketSetup;
