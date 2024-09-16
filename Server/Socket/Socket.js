const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');  // Import your User model
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // You should store this in a secure place, like environment variables

const socketSetup = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173", // Adjust this to your front-end URL
      methods: ["GET", "POST"]
    }
  });

  const activeUsers = new Map();  

  // Middleware to authenticate and extract user info from token
    io.use((socket, next) => {
      const token = socket.handshake.auth.token?.replace(/^Bearer\s/, '');
      // console.log(token)
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify the token
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error: Invalid token'));
        }

        // Attach user info to the socket object for further use
        socket.user = decoded;  // Assuming the token payload contains _id

        try {
          // Update user as active in the database
          await User.findByIdAndUpdate(socket.user._id, { isActive: true });

          // Add the user to activeUsers map
          activeUsers.set(socket.id, socket.user._id);
          next();  // Proceed to connection event
        } catch (error) {
          next(new Error('Database error: Unable to update user status'));
        }
      });
    });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id, 'User ID:', socket.user._id);

    // Handle room joining
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`User with ID: ${socket.user._id} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', ({ roomId, message }) => {
      const userId = socket.user._id;  // Get the user ID from the socket object
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
