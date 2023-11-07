import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make an API call to authenticate the user using formData
      // You'll need to implement this API call using Axios or Fetch
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Login successful
        console.log('User logged in successfully');
      } else {
        // Login failed
        console.error('User login failed');
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
    </div>
  );
}

export default Login;
