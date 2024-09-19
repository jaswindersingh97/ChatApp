import React, { useEffect, useState } from 'react';
import senticon from './../assets/senticon.png';
import style from './Right.module.css';
import getMessage from '../api/getMessage';
import { useAuth } from '../context/AuthContext';
import { sendMessage, onMessageReceived, removeMessageListener } from '../Sockets/socketService';

function Right({ selectedChat, chats, setChats }) {
  const { token, currentUserId } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const { _id, name } = selectedChat || {}; // Handle case where selectedChat might be undefined

  useEffect(() => {
    if (_id) {
      setLoading(true); // Start loading before fetching chats
      getChats(); // Fetch messages when the chat is selected
    }
  }, [_id]); // Dependency array includes _id to refetch on chat change

  const getChats = async () => {
    try {
      const data = await getMessage({ chatId: _id, token });
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching chats
    }
  };

  useEffect(() => {
    const handleMessage = (data) => {
      console.log("Message received:", data);
  
      // Ensure the message is for the currently selected chat
      if (data && data.chat && data.chat === _id) {
        setChats((prevChats) => [...prevChats, data]); // Append the new message to the chat
      }
    };

    // Attach the message listener
    onMessageReceived(handleMessage);

    // Cleanup function to remove the listener
    return () => {
      removeMessageListener(handleMessage); // Properly remove the listener
    };
  }, [_id]); // Dependency array includes _id to handle chat-specific messages

  const onKeysDown = (e) => {
    if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
      onFormSubmit(e);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages

    try {
      sendMessage(_id, message); // Send message via socket
      setMessage(""); // Clear the input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    // Show a loading spinner or a message while chats are being fetched
    return <div className={style.container}><p>Loading chats...</p></div>;
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>{ name || "Select a chat"}</h1>
        {console.log("hi")}
        {/* Fallback if no chat is selected */}
      </div>
      <div className={style.content}>
        {chats.length > 0 ? (
          chats.map((item, index) => (
            <div
              key={index}
              className={`${style.element} ${
                item.sender._id === currentUserId ? style.sent : style.received
              }`}
            >
              <p>{item.content}</p>
              <span>{formatDate(item.updatedAt)}</span>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div className={style.messageContainer}>
        <form onSubmit={onFormSubmit}>
          <textarea
            onKeyDown={onKeysDown}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">
            <img src={senticon} alt="send" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Right;
