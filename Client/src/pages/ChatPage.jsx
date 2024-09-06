import React from 'react'
import styles from './ChatPage.module.css';
import Dummy from '../components/dummy';
function ChatPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button>SearchBar</button>
        <h1>ChatApp</h1>
        <button>notification</button>
        <button>Profile</button>
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
            <div className={styles.leftheader}>
              <p> MY CHATS</p>
              <button>New Group chat +</button>
            </div>
            <div className={styles.leftbody}>
              <Dummy number={1}/>
            </div>
        </div>
        <div className={styles.right}>
            right
        </div>
      </div>
    </div>
  )
}

export default ChatPage
