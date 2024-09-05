import React, { useState } from 'react';
import styles from './SignIn.module.css';
import authApi from '../api/authApi';

function SignIn() {
  const endpoints = "/signin";
  const [user, SetUser] = useState({
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    SetUser((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const apiHandler = async () => {
    try {
      const response = await authApi({ endpoints, user });
      return response;
    } catch (error) {
      console.error("Error from API:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const {token} = await apiHandler();  // Wait for the API call to finish
    console.log("Submit Response:", token);
    localStorage.setItem("token","Bearer "+token);
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default SignIn;
