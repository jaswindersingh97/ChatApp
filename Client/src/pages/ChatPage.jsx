import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import Dummy from '../components/dummy';
import SearchOverlay from '../components/SearchOverlay'; // Import the new component
import getPrevChats from '../api/chatGroups';

function ChatPage() {
  useEffect(()=>{
    getPrevChat();
  },[])

  const [prevChats,SetPrevChats] = useState([]);

  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const closeSearch = () => {
    setSearchVisible(false);
  };

  const getPrevChat = async() =>{
    const token = localStorage.getItem("token")
    console.log(token);
    const data=await getPrevChats({token})
    SetPrevChats(data);
  }

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
          {
            prevChats.map((item,index)=>{
              return(
                <div key={index} className={styles.ele}>
                <h2>{item.chatName=="sender"?"hi":item.chatName}</h2>
              <div>
              <span>last Sender</span>
              <p>last message</p>
              </div> 
            </div>
              )
              
            })
          }
          </div>
          {/* <Dummy number={5}/> */}
          {/* {prevChats.length} */}
        </div>
        <div className={styles.right}>right</div>
      </div>
    </div>
  );
}

export default ChatPage;
