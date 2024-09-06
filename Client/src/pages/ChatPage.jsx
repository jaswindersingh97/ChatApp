import React, { useState } from 'react';
import styles from './ChatPage.module.css';
import Dummy from '../components/dummy';
import SearchOverlay from '../components/SearchOverlay'; // Import the new component

function ChatPage() {
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const closeSearch = () => {
    setSearchVisible(false);
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
            <Dummy number={15} />
          </div>
        </div>
        <div className={styles.right}>right</div>
      </div>
    </div>
  );
}

export default ChatPage;
