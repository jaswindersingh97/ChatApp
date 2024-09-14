import React, { useEffect, useState } from 'react';
import senticon from './../assets/senticon.png';
import style from './Right.module.css';
import getMessage from '../api/getMessage';
import { useAuth } from '../context/AuthContext';
import CreateMessage from '../api/CreateMessage';

function Right({ selectedChat }) {
  const { token, currentUserId } = useAuth();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const { _id, name } = selectedChat || {}; // Handle case where selectedChat might be undefined

  useEffect(() => {
    if (_id) {
      getChats();
    }
  }, [selectedChat]);

  const onKeysDown = (e) => {
    if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
      onFormSubmit(e);
    }
  };

  const getChats = async () => {
    try {
      const data = await getMessage({ chatId: _id, token });
      setChats(data || []);
      console.log(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages
    try {
      // You can add your API call to send the message here
      const data = await CreateMessage({token,message,_id})
      console.log("Sending message:", message , data);
      // Clear the input after sending
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>{name || "Select a chat"}</h1> {/* Fallback if no chat is selected */}
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
