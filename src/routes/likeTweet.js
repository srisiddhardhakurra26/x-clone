// likeTweet.js
const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweet'); // Adjust the path based on your file structure

router.post('/api/likeTweet/:tweetId', async (req, res) => {
    const tweetId = req.params.tweetId;
    const userId = req.user.userId; // Assuming you have the user ID from authentication
  
    try {
      const tweet = await Tweet.findById(tweetId);
  
      if (!tweet) {
        return res.status(404).send('Tweet not found');
      }
  
      // Check if the user has already liked the tweet
      if (tweet.likes.includes(userId)) {
        return res.status(400).send('User has already liked this tweet');
      }
  
      // Add the user ID to the likes array and increment the likes count
      tweet.likes.push(userId);
      tweet.likesCount += 1;
      await tweet.save();
  
      res.status(200).send('Tweet liked successfully');
    } catch (error) {
      console.error('Error liking tweet:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;
