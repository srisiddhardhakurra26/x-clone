const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/api/register', async (req, res) => {
  // Registration route logic here
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists by searching for their email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user document using the Mongoose model
    const newUser = new User({ name, email, password });

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the saltRounds (10) as needed

    // Create a new user document using the Mongoose model with the hashed password
    newUser.password = hashedPassword

    // Save the user to the database
    await newUser.save();

    // Registration successful
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;
