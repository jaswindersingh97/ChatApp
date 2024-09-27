const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');  // Import your User model
const Message = require('./../models/MessageModel');  // Assuming this is your Message model
const Chat = require('./../models/ChatModel');  // Assuming you have a Chat model
const ChatUser = require('./../models/ChatUser');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // You should store this in a secure place, like environment variables

const socketSetup = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173", // Adjust this to your front-end URL
      methods: ["GET", "POST"]
    }
  });

  const resetUnseenCount = async (userId, chatId) => {
    await ChatUser.findOneAndUpdate(
      { User_id: userId, Chat_id: chatId },
      { unseen_count: 0 }, // Reset unseen count to 0 for this user
      { new: true }
    );
  };
  

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

  io.on('connection', async(socket) => {
    
    const roomsId = await Chat.find({users:{$in : [socket.user._id] }}).select("_id");
    await roomsId.forEach(element => {
      socket.join(element._id.toString());
    });
    await console.log("rooms joined")
    console.log('A user connected:', socket.id, 'User ID:', socket.user._id);
    // console.log('rooms which users is part of are:',roomsId);

    // Handle room joining
    socket.on('joinRoom', async ({ roomId }) => {
      // Join the specified room
      // socket.join(roomId);
      const userId = socket.user._id;
    
      // Retrieve the latest message in the room
      const latestMessage = await Message.findOne({ chat: roomId }).sort({ createdAt: -1 });
    
      if (latestMessage) {
        // Update the last seen message ID for the user in ChatUser collection
        await ChatUser.findOneAndUpdate(
          { User_id: userId, Chat_id: roomId },
          { 
            $set: { last_seen_message_id: latestMessage._id,
              unseen_count: 0
             }, // Update to the latest message
          },
          { new: true, upsert: true } // Create if it doesn't exist
        );
      }
    
      console.log(`User with ID: ${userId} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ roomId, message }) => {
      const userId = socket.user._id; // Sender's user ID
      console.log(`Message from user ${userId}: ${message}`);
    
      try {
        // Create and save the message to the database
        const newMessage = await Message.create({
          sender: userId,
          content: message,
          chat: roomId,
        });
    
        // Populate the sender details for the response
        const fullMessage = await newMessage.populate('sender');
    
        // Update the latest message in the chat
        const chat = await Chat.findByIdAndUpdate(roomId, {
          latestMessage: fullMessage,
        }, { new: true });
    
        // Extract user IDs directly from the chat document
        const chatUsers = chat.users;
    
        // Increment unseen count for all users except the sender
        for (const chatUserId of chatUsers) {
          if (chatUserId.toString() !== userId.toString()) {
            // Increment unseen count for other users
            await ChatUser.findOneAndUpdate(
              { User_id: chatUserId, Chat_id: roomId },
              { $inc: { unseen_count: 1 } },
              { new: true, upsert: true }
            );
          }
        }
        console.log("insende message")
    
        // Emit the message to the room
        io.to(roomId).emit('receiveMessage', fullMessage);
    
        // Emit the updated chat list (with unseen counts attached) to the room
        io.to(roomId).emit('updatelist', chat.populate("latestMessage users"));
    
        console.log("full message", fullMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });
        
    socket.on('messageSeen', async ({ messageId }) => {
      const userId = socket.user._id;
      
      // Find the message by ID
      const message = await Message.findById(messageId);
      
      // Check if the message exists
      if (!message) {
        console.error('Message not found');
        return;
      }
    
      // Update the readBy field in the message
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId); // Add the user to the readBy array
        await message.save(); // Save the updated message
      }
    
      // Find the chat associated with the message
      const chatId = message.chat;
    
      // Update the unseen count in ChatUser for the user in that chat
      const chatUser = await ChatUser.findOne({ User_id: userId, Chat_id: chatId });
      
      if (chatUser && chatUser.unseen_count > 0) {
        chatUser.unseen_count -= 1; // Decrease the unseen count
        await chatUser.save(); // Save the updated count
      }
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
