import React, { useState } from 'react'
import styles from './SignIn.module.css';

function SignIn() {
  const changeHandler = (e) => {
    const { name, value } = e.target;
    SetUser((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const [user, SetUser] = useState({
    email: "",
    password: ""
  });

  const submitHandler = (e) => {
    e.preventDefault();
    // Add your logic for sign-in, such as API requests or form validation
    console.log("User data: ", user);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
        <p>Email Address:</p>
        <input 
          type='email'
          name='email'
          value={user.email}
          onChange={changeHandler}
          placeholder='Enter your Email Address'
        />
        <p>Password:</p>
        <input 
          type='password'
          name='password'
          value={user.password}
          onChange={changeHandler}
          placeholder='Password'
        />
        <div className={styles.button}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
