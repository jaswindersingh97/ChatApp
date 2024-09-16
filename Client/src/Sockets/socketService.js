import { io } from 'socket.io-client';

let socket; // Declare socket without initializing

// Function to connect the socket to the server
export const connectSocket = (serverUrl, userId) => {
  if (!socket) {
    socket = io(serverUrl);

    socket.on('connect', () => {
      console.log('Client connected, socket ID:', socket.id);

      // Emit userId to the server after connection
      if (userId) {
        socket.emit('userConnected', { userId });
      }
    });
  }

  return socket;
};

// Function to join a room
export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit('joinRoom', { roomId });
  } else {
    console.error('Socket not connected');
  }
};

// Function to send a message
export const sendMessage = (roomId, message) => {
  if (socket) {
    socket.emit('sendMessage', { roomId, message });
  } else {
    console.error('Socket not connected');
  }
};

// Function to listen for messages
export const onMessageReceived = (callback) => {
  if (socket) {
    socket.on('receiveMessage', (data) => {
      callback(data);
    });
  } else {
    console.error('Socket not connected');
  }
};

// Function to disconnect from the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Reset the socket so it can be reconnected
  }
};

export default socket;
