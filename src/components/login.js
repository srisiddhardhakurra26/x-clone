import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [notFoundError, setNotFoundError] = useState(false); // Error flag for user not found
  const [wrongCredentialsError, setWrongCredentialsError] = useState(false); // Error flag for wrong credentials

  const history = useHistory();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); // Store the token in localStorage
        localStorage.setItem('username', data.username); // Store the username in localStorage
        console.log('User logged in successfully');
        history.push('/tweetForm'); //redirect to home page
      } 
      else if (response.status === 400) {
        const data = await response.json();
        if (data.message === 'User not found') {
          setNotFoundError(true);
          setWrongCredentialsError(false);
        }
      }
      else {
        const data = await response.json()
        if (data.message === 'Invalid password'){
          setNotFoundError(false);
          setWrongCredentialsError(true);
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
      {notFoundError && <p>User not found</p>}
      {wrongCredentialsError && <p>Invalid Password</p>}
    </div>
  );
}

export default Login;
