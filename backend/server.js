// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const connectDB = require('./db'); // Import the database connection function
const Note = require('./models/Note'); // Import the Note model

// Initialize express app
const app = express();

// Middleware for parsing JSON and enabling CORS
app.use(express.json());
app.use(cors()); // Enable CORS

// Connect to the MongoDB Database
connectDB();

// Define a route for the root ("/")
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database');
});

// POST route to create a new note
app.post('/api/note', async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: 'Note content is required' });
  }

  try {
    // Step 1: Create a new note without a URL initially
    let note = new Note({
      content: content,
      url: '' // We will assign this after the initial save
    });

    // Step 2: Save the note without the URL
    note = await note.save();

    // Step 3: After the note is saved, we now generate a URL based on the note's `_id`
    note.url = `/note/${note._id}`; // Generate the unique URL using the note's _id

    // Step 4: Save the note again, now with the URL field populated
    await note.save();

    // Step 5: Respond with the created note's URL
    res.status(201).json({
      message: 'Note created successfully',
      url: note.url
    });
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// GET route to retrieve all notes (for testing, can be removed later)
app.get('/api/note', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes', error: error.message });
  }
});

// Set the port to use environment variable PORT or default to 5000
const port = process.env.PORT || 5000;

// Start the server and listen on the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
