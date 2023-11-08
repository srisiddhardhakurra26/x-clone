const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tweet = require('../models/tweet');

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
  const token = req.header('x-auth-token'); // Assuming you set the token in the header
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

// Route to post a new tweet
router.post('/api/postTweet', authenticateUser, async (req, res) => {
    const { text, username } = req.body;
    const userId = req.user.userId; // Get the authenticated user's ID
  
    try {
        const newTweet = new Tweet({
        text: text, // Extract tweet text
        author: username,
      });
  
      await newTweet.save();
  
      res.status(201).json({ message: 'Tweet posted successfully' });
    } catch (error) {
      console.error('Error posting tweet:', error);
      res.status(500).json({ message: 'Tweet posting failed' });
    }
  });
  
  module.exports = router;
  