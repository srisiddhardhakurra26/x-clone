// Assuming Express.js for illustration
const path = require('path');
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const Tweet = require('../models/tweet');

// Delete a tweet
router.delete('/api/deleteTweet/:id', async (req, res) => {
  try {
    const tweetId = req.params.id;
    const authToken = req.header('x-auth-token');

    // Check authentication (you may want to enhance this part)
    if (!authToken) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    // Check if the user making the request is the author of the tweet
    if (tweet.author !== req.headers['x-username']) {
        return res.status(403).json({ msg: 'Unauthorized to delete this tweet' });
    }

    // Delete the tweet
    await Tweet.findByIdAndDelete(tweetId);

    // If the tweet had an associated image, delete the image file
   // Delete the associated image (if it exists)
   if (tweet.image) {
    const imagePath = path.join(__dirname, '../', tweet.image);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
      } else {
        console.log('Image deleted successfully');
      }
    });
  }

    res.json({ msg: 'Tweet deleted successfully' });
  } catch (error) {
    console.error('Error deleting tweet:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
