import React, { useState } from 'react'
import styles from './SignUp.module.css';
import authApi from '../api/authApi';
function SignUp() {
  const endpoints = "/signup";
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [pass, setPass] = useState({ pass: "", confirmpass: "" });

  const submitHandler = async(e) => {
    e.preventDefault();
    
    if (pass.pass === pass.confirmpass) {
      setUser((oldData) => ({
        ...oldData, 
        password: pass.pass
      }));
      // You can add more logic here, like making an API call or further validation
      alert("Form submitted successfully!");
      const response = await apiHandler();  // Wait for the API call to finish

      console.log(response)
    } else {
      alert("Passwords do not match");
    }
  };

  const apiHandler = async () => {
    try {
      const response = await authApi({ endpoints, user });
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error("Error from API:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
      
        <p>Name:</p>
        <input
          type='text'
          name='name'
          value={user.name}
          onChange={handleInputChange}
          placeholder='Enter your name'
        />
        
        <p>Email Address</p>
        <input
          type='email'
          name='email'
          value={user.email}
          onChange={handleInputChange}
          placeholder='Enter your Email'
        />
        <p>Password</p>
        <input
          type='password'
          name='pass'
          value={pass.pass}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
        />
        
        <p>Confirm Password</p>
        <input
          type='password'
          name='confirmpass'
          value={pass.confirmpass}
          onChange={handlePasswordChange}
          placeholder='Confirm Password'
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignUp;
