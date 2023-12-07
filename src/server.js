const express = require('express');
const mongoose = require('mongoose');
// Replace this line
// const fetch = require('node-fetch');
// with this line
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

const registrationRoutes = require('./routes/registration');
const loginRoutes = require('./routes/login');
const tweetRoutes = require('./routes/tweet');
const tweetsRoutes = require('./routes/tweets');
const deleteTweets = require('./routes/deleteTweet');
const userProfile = require('./routes/userProfile');

// Define the MongoDB URI (replace with your actual MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/x-clone';

// Connect to the MongoDB database
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection was successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware for parsing JSON
app.use(express.json());

// Use the route modules
app.use(registrationRoutes);
app.use(loginRoutes);
app.use(tweetRoutes);
app.use(tweetsRoutes);
app.use(deleteTweets);
app.use(userProfile);

// New route for image generation
app.post('/api/generateImage', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = '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'; // Replace with your OpenAI API key

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-2',
        prompt: prompt,
        n: 1,
        size: '256x256',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.data[0].url;
      res.json({ imageUrl });
    } else {
      console.error('Image generation failed');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
