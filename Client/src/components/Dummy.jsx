import React from 'react';
import styles from './Dummy.module.css'; // Make sure to import your styles if needed

function Dummy({ number }) {
  return (
    <>
      {Array.from({ length: number }, (_, index) => (
        <div key={index} className={styles.chatuser}>
          <h4>chatName</h4>
          <p>
            <strong>lastmessageusername :</strong> lastMessage
          </p>
        </div>
      ))}
    </>
  );
}

export default Dummy;
