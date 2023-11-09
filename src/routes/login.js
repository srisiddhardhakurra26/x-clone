const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/api/login', async (req, res) => {
  // Login route logic here
  const { email, password } = req.body;
  
    try {
      // Check if the user exists by searching for their email
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
      }
  
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }
  
      // Create a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: existingUser._id }, 'your-secret-key', { expiresIn: '1h' });
  
      // Send the token back to the client
    res.status(200).json({ token, username: existingUser.name });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = router;
