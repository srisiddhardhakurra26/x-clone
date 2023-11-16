const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Replace with your user model
const Tweet = require('../models/tweet'); // Replace with your post model

// Get user profile by username
router.get('/api/userProfile/:username', async (req, res) => {
  try {
    const username = req.params.username;

    // Fetch user details
    console.log('Fetching user profile for username:', username);
    const user = await User.findOne({ name: username });
    console.log('User found:', user);


    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch user posts
    const userPosts = await Tweet.find({ author: username });

    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
