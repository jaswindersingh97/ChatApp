import { io } from 'socket.io-client';

let socket; // Declare socket without initializing

// Function to connect the socket to the server
export const connectSocket = (serverUrl, token) => {
  if (!socket) {
    socket = io(serverUrl, {
      auth: {
        token: token, // Pass token for authentication
      },
    });

    socket.on('connect', () => {
      console.log('Client "Socket" connected');
    });

    socket.on('disconnect', () => {
      console.log('Client "Socket" disconnected');
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
    socket.on('receiveMessage', callback);
  } else {
    console.error('Socket not connected');
  }
};

// Function to remove the message listener
export const removeMessageListener = (callback) => {
  if (socket) {
    socket.off('receiveMessage', callback);
  } else {
    console.error('Socket not connected');
  }
};

export const onNewMessage = (callback) => {
  if (socket) {
    socket.on('updatelist', callback);
  } else {
    console.error('Socket not connected');
  }
};

// Function to remove the message listener
export const removeNewMessage = (callback) => {
  if (socket) {
    socket.off('updatelist', callback);
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
