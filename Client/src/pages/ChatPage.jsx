import React from 'react'
import styles from './ChatPage.module.css';
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
            left
        </div>
        <div className={styles.right}>
            right
        </div>
      </div>
    </div>
  )
}

export default ChatPage
