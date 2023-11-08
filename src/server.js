const express = require('express');
const mongoose = require('mongoose');
const app = express()

const registrationRoutes = require('./routes/registration');
const loginRoutes = require('./routes/login');

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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
