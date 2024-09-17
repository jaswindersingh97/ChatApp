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
    prevChats, // state to load prevChats
    prevChatsName, // state to load prevChatsname
    chats, 
    setChats,
    } = useAuth(); // Access currentUserId from auth context
    
  const [showGroup,setShowGroup] =useState(false);  

  useEffect(()=>{ // useEffect to fetch chat group names from api
    fetchChats();//fetch the chat names in left
  },[searchVisible])

  useEffect(() => { // UseEffect to connect the socket connection
    // Connect socket on mount, passing the token
    connectSocket('http://localhost:3000', token);
    // Disconnect the socket on component unmount
    return () => {
      disconnectSocket();
    };
  }, [token]);  // Use token as dependency, currentUserId is not required here

  const selectChat = ({ _id, name }) => {
    setSelectedChat({ _id, name });
    joinRoom(_id);  // Join the room when a chat is selected
  };

  return (
    <div className={styles.container}>
      {searchVisible && <SearchOverlay closeSearch={toggleSearch} />}
      {showGroup && <CreateGroup/>}
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
            <button onClick={()=>{setShowGroup(!showGroup)}}>New Group chat +</button>
          </div>
          <div className={styles.leftbody}>
            {prevChats.map((chat, index) => (
              <div 
                key={chat._id} 
                onClick={() => {
                  selectChat(prevChatsName[index]);
                }} 
                className={styles.ele}>
                <h2>{prevChatsName[index] ? prevChatsName[index].name : 'Loading...'}</h2>
                <div>
                  <span>{chat.latestMessage ? chat.latestMessage.sender.name : "No Sender"}</span>
                  <p>{chat.latestMessage ? chat.latestMessage.content : "No messages yet"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          {selectedChat ? 
            <Right selectedChat={selectedChat} setChats={setChats} chats={chats} /> 
            : 
            <div style={{ display: 'flex', padding: "20px" }}>
              Select a chat to start messaging
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
