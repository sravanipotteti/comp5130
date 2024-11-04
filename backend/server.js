// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config(); // This loads the variables from your .env file

// Import necessary modules
const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const connectDB = require('./db'); // Import the database connection function
const Note = require('./models/Note'); // Import the Note model
const path = require('path');
const authRoutes = require('./routes/auth');
const { encrypt, decrypt } = require('./utils/encryption');


// Initialize express app
const app = express();


// Middleware for parsing JSON and enabling CORS
app.use(express.json());
app.use(cors({
  origin: 'https://localhost:3000', // Replace with frontend URL
  credentials: true
}));

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert'),
}


// Connect to the MongoDB Database
connectDB();

app.use('/api/auth', authRoutes);

// Define a route for the root ("/")
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database');
});

// POST route to create a new note
app.post('/api/note', async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).send( 'Note content is required' );
  }

  try {
    // Encrypt content
    const encryptedContent = encrypt(content);

    // Save the note with encrypted content
    let note = new Note({
      content: encryptedContent,
      url: ''
    });

    note = await note.save();

    note.url = `/note/${note._id}`;
    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      url: note.url
    });
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});


// GET route to retrieve a note by its ID and delete it after retrieval
app.get('/api/note/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Decrypt content
    const decryptedContent = decrypt(note.content);

    res.status(200).send(decryptedContent );
  } catch (error) {
    console.error('Error retrieving and decrypting note:', error.message);
    res.status(500).json({ message: 'Error retrieving and decrypting note', error: error.message });
  }
});

// DELETE route to destroy a note by its ID
app.delete('/api/note/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id); // Delete note by ID

    if (!note) {
      return res.status(404).send( 'Note not found' );
    }

    res.status(200).json({ message: 'Note destroyed successfully' });
  } catch (error) {
    console.error('Error destroying note:', error.message);
    res.status(500).json({ message: 'Error destroying note', error: error.message });
  }
});


// Serve static files from the frontend/build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve the React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Set the port to use environment variable PORT or default to 5000
const port = process.env.PORT || 5000;

// Define the HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Secure server running on :${port}`);
});