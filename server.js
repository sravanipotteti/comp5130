const express = require('express');
const connectDB = require('./db'); // Import the database connection function
require('dotenv').config(); // Load environment variables from .env file
const Note = require('./models/Note'); // Import the Note model

// Initialize the Express app (This must be done before defining routes)
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Connect to the MongoDB Database
connectDB();

// POST route to create a new note
app.post('/api/note', async (req, res) => {
  const { content, url } = req.body;

  // Validate the request body
  if (!content || !url) {
    return res.status(400).json({ message: 'Content and URL are required' });
  }

  try {
    const note = await Note.create({ content, url });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
});

// GET route to retrieve a note by its unique URL
app.get('/api/note/:url', async (req, res) => {
  try {
    const note = await Note.findOne({ url: req.params.url });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note', error });
  }
});

// Define a sample route for testing the server
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database');
});

// Set the port to use environment variable PORT or default to 3000
const port = process.env.PORT || 3000;

// Start the server and listen on the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
