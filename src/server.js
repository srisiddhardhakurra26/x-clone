const mongoose = require('mongoose');

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

// Your server code here
const express = require('express');
const app = express();
const User = require('./models/user'); // Import your user model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for authentication

// Middleware for parsing JSON
app.use(express.json());

// Define the registration route
app.post('/api/register', async (req, res) => {
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

// Define the login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists by searching for their email
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
      }
  
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
        }
  
      // Create a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ userId: existingUser._id }, 'your-secret-key', { expiresIn: '1h' });
  
      // Send the token back to the client
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
