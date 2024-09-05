import React, { useState } from 'react'
import styles from './SignUp.module.css';

function SignUp() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [pass, setPass] = useState({ pass: "", confirmpass: "" });

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (pass.pass === pass.confirmpass) {
      setUser((oldData) => ({
        ...oldData, 
        password: pass.pass
      }));
      // You can add more logic here, like making an API call or further validation
      alert("Form submitted successfully!");
    } else {
      alert("Passwords do not match");
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
        <div className={styles.button}>
        <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
