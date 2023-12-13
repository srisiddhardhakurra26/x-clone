const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Parse JSON in the request body
app.use(express.json());
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

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Rename the file to avoid naming conflicts
  },
});

const upload = multer({ storage });

// Route to post a new tweet with text and image
router.post('/api/postTweet', authenticateUser, upload.single('image'), async (req, res) => {
  const { text, username } = req.body;
  const userId = req.user.userId; // Get the authenticated user's ID

  try {
    let imageUrl = null;

    // Check if an image was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newTweet = new Tweet({
      text: text,
      author: username,
      image: imageUrl,
    });

    await newTweet.save();

    res.status(201).json({ message: 'Tweet posted successfully' });
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).json({ message: 'Tweet posting failed' });
  }
});

// Route to serve uploaded images
router.use('/uploads', express.static('uploads'));

module.exports = router;
