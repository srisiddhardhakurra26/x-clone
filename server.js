const express = require('express');
const mongoose = require('mongoose');
// Replace this line
// const fetch = require('node-fetch');
// with this line
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config({ path: './src/.env' });
dotenv.config();
const allowedOrigins = ['http://your-frontend-domain.com', 'https://your-frontend-domain.com'];
const app = express();
// Enable CORS
app.use(cors());

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// }));

const registrationRoutes = require('./src/routes/registration.js');
const loginRoutes = require('./src/routes/login');
const tweetRoutes = require('./src/routes/tweet');
const tweetsRoutes = require('./src/routes/tweets');
const deleteTweets = require('./src/routes/deleteTweet');
const userProfile = require('./src/routes/userProfile');

// Define the MongoDB URI (replace with your actual MongoDB URI)
const mongoURI = process.env.MONGODB_URI;

// Connect to the MongoDB database
mongoose.connect(mongoURI);

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
  const apiKey = process.env.OPENAI_API_KEY;

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
      console.error('Image generation failed:', await response.text());
      res.status(500).json({ error: 'Image generation failed' });
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
