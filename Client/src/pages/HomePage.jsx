import React, { useState } from 'react';
import styles from './HomePage.module.css';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
function HomePage() {
    const [signForm,setSignForm]=useState(false);
  return (
    <div className={styles.container}>
        <div className={styles.box}>    
            <div className={styles.header}>
                <h1>Chat App</h1>
            </div>
            <div className={styles.body}>
                <div className={styles.pageSelector}>
                    <button onClick={()=>setSignForm(true)}>Login</button>
                    <button onClick={()=>setSignForm(false)}>Sign Up</button>
                </div>
                <div className={styles.signForm}>
                    {
                        signForm?<SignIn/>:<SignUp/>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomePage
