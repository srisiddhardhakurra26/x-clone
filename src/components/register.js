import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
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

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      // Make an API call to register the user using formData
      // You'll need to implement this API call using Axios or Fetch
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful
        console.log('User registered successfully');
      } else {
        // Registration failed
        console.error('User registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegistration}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleInputChange}
        />
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
        <button type="submit">Register</button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;
