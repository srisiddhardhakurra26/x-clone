const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  text: String,
  author: {
    type: String,
    required: true, // Reference to the User model
  },
  timestamp: { type: Date, default: Date.now },
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;