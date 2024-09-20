import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import SearchOverlay from '../components/SearchOverlay'; 
import Right from '../components/Right';
import CreateGroup from './../components/CreateGroup';
import { useAuth } from '../context/AuthContext';
import { connectSocket, disconnectSocket, joinRoom } from '../Sockets/socketService'; 

function ChatPage() {
  const {
    token,  // token from localstorage
    searchVisible,  // state to show / hide search new chat
    toggleSearch, // hide show search new chat
    selectedChat, // state to select chat
    setSelectedChat, // setstate to select chat
    fetchChats, // method to load the prevchats
    prevChats, // state to load prevChats without sender name in one to one chat
    prevChatsName, // state to load prevChatsname with sender name in one to one chat
    chats, 
    setChats,
    showGroup, 
    setShowGroup
  } = useAuth(); // Access currentUserId from auth context
    
  useEffect(() => { // Fetch chat group names from API on load
    fetchChats(); 
  }, [searchVisible]);

  useEffect(() => { // Connect the socket connection
    connectSocket('http://localhost:3000', token); // Pass token to connectSocket
    return () => {
      disconnectSocket(); // Clean up on unmount
    };
  }, [token]);

  const selectChat = ({ _id, name }) => {
    setSelectedChat({ _id, name });
    joinRoom(_id);  // Join the room when a chat is selected
  };

  return (
    <div className={styles.container}>
      {searchVisible && <SearchOverlay closeSearch={toggleSearch} />}
      <div className={styles.header}>
        <button onClick={toggleSearch}>SearchBar</button>
        <h1>ChatApp</h1>
        <button>Notification</button>
        <button>Profile</button>
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.leftheader}>
            <p>MY CHATS</p>
            <button onClick={() => setShowGroup(!showGroup)}>New Group chat +</button>
          </div>
          <div className={styles.leftbody}>
            {prevChats.map((chat, index) => (
              <div 
                key={chat._id} 
                onClick={() => selectChat(prevChatsName[index])} 
                className={styles.ele}>
                <h2>{prevChatsName[index] ? prevChatsName[index].name : 'Loading...'}</h2>
                <div>
                  <span>{chat.latestMessage ? chat.latestMessage.sender.name : "No Sender"}</span>
                  <p>{chat.latestMessage ? chat.latestMessage.content : "No messages yet"}</p>
                </div>
                <div className={styles.unseenCounter}>
                  <span>{chat.unseen_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          {selectedChat ? (
            <Right selectedChat={selectedChat} setChats={setChats} chats={chats} /> 
          ) : (
            <div style={{ display: 'flex', padding: "20px" }}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>

      {showGroup && <CreateGroup />} {/* Show group creation form */}
    </div>
  );
}

export default ChatPage;
