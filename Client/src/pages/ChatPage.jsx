import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import SearchOverlay from '../components/SearchOverlay'; 
import getPrevChats from '../api/chatGroups';
import Right from '../components/Right';
import { useAuth } from '../context/AuthContext';
import { connectSocket, disconnectSocket } from '../Sockets/socketService'; 

function ChatPage() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");
  const [prevChats, setPrevChats] = useState([]);
  const [prevChatsName, setPrevChatsName] = useState([]);
  const { token, currentUserId } = useAuth(); // Access currentUserId from auth context
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Connect socket on mount, passing the userId
    const socket = connectSocket('http://localhost:3000', currentUserId);
    console.log(currentUserId);
    // Fetch previous chats
    const getPrevChat = async () => {
      const data = await getPrevChats({ token });
      setPrevChats(data);

      // Generate chat names after fetching chats
      const chatNames = generateChatNames(data);
      setPrevChatsName(chatNames);
    };

    getPrevChat();

    return () => {
      // Disconnect the socket on component unmount
      disconnectSocket();
    };
  }, [token, currentUserId]);  // Ensure currentUserId is passed

  const selectChat = ({ _id, name }) => {
    setSelectedChat({ _id, name });
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const closeSearch = () => {
    setSearchVisible(false);
  };

  // Function to get chat names based on whether it's a group chat or one-on-one
  const generateChatNames = (array) => {
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
              <div 
                key={chat._id} 
                onClick={() => selectChat(prevChatsName[index])} 
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
