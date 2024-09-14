import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import SearchOverlay from '../components/SearchOverlay'; 
import getPrevChats from '../api/chatGroups';
import Right from '../components/Right';
import CreateGroup from '../components/CreateGroup';
import { useAuth } from '../context/AuthContext';

function ChatPage() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");
  const [prevChats, SetPrevChats] = useState([]);
  const [prevChatsName, SetPrevChatsName] = useState([]);
  const {token,currentUserId} = useAuth();

  useEffect(() => {
    // Fetch previous chats
    const getPrevChat = async () => {
      const data = await getPrevChats({ token });
      SetPrevChats(data);

      // Once chats are fetched, generate their names
      const chatNames = getChatName(data);
      SetPrevChatsName(chatNames);
    };

    getPrevChat();
  }, []);  // Empty array to ensure this runs once on component mount

  const selectChat = ({ _id,name }) => {
    setSelectedChat({_id,name});
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const closeSearch = () => {
    setSearchVisible(false);
  };

  // Function to get chat names based on whether it's a group chat or one-on-one
  const getChatName = (array) => {
    return array.map((item) => {
      if (item.isGroupChat) {
        return { _id: item._id, name: item.chatName };
      } else {
        const user = item.users.find((user) => user._id !== currentUserId);
        return { _id: item._id, name: user ? user.name : "Unknown User" };
      }
    });
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
            {prevChats.map((chat, index) => (
              <div key={chat._id} onClick={() => selectChat(prevChatsName[index])} className={styles.ele}>
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
          <Right selectedChat={selectedChat} />
          {/* Testing */}
          {/* <CreateGroup/> */}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
