import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import SearchOverlay from '../components/SearchOverlay'; 
import getPrevChats from '../api/chatGroups';
import Right from '../components/Right';

function ChatPage() {
  const [searchVisible, setSearchVisible] = useState(false);
  
  
  const currentUserId = localStorage.getItem("id"); 

  const [prevChats, SetPrevChats] = useState([]);

  useEffect(() => {
      getPrevChat();
  }, [searchVisible]);


  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const closeSearch = () => {
    setSearchVisible(false);
  };

  const getPrevChat = async () => {
    const token = localStorage.getItem("token");
    // console.log(token);
    const data = await getPrevChats({ token });
    SetPrevChats(data);
  };

  return (
    <div className={styles.container}>
      {searchVisible && <SearchOverlay closeSearch={closeSearch} />}
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
            <button>New Group chat +</button>
          </div>
          <div className={styles.leftbody}>
            {prevChats.map((chat, index) => {
              const otherUser = chat.users.find(user => user._id !== currentUserId); // Find the other user in one-on-one chat

              return (
                <div key={index} className={styles.ele}>
                  <h2>
                    {chat.isGroupChat ? chat.chatName : (otherUser ? otherUser.name : "No Name")}
                  </h2>
                  <div>
                    <span>{chat.latestMessage ? chat.latestMessage.sender.name : "No Sender"}</span>
                    <p>{chat.latestMessage ? chat.latestMessage.content : "No messages yet"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.right}>
        select a chat
        {/* <Right/> */}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
