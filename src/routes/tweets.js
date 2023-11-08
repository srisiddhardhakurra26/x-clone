
const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweet');

// Endpoint for getting all tweets
router.get('/api/getTweets', async (req, res) => {
  try {
    // Fetch all tweets from the database
    const tweets = await Tweet.find();

    // Return the tweets as JSON
    res.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ message: 'Failed to fetch tweets' });
  }
});

module.exports = router;
