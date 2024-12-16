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
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./models/User');
const setupSwagger = require('./swaggerConfig');


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
  cert: fs.readFileSync('./certs/server.crt'),
}


// Connect to the MongoDB Database
connectDB();


// Setup Swagger
setupSwagger(app); // Add Swagger middleware

// Routes
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
// GET route to confirm display and destruction of a note
app.get('/api/note/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send('<h1>Note not found</h1>');
    }

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Read and Destroy Note</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
            background-color: #f9f9f9;
          }
          .app-header {
            background-color: #3b5998;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 150px;
            padding: 0;
            margin: 0;
          }
          .header-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 0;
          }
          .header-subtitle {
            font-size: 1.2rem;
            font-style: italic;
            margin: 0;
          }
          .note-view-container {
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px;
            font-size: 16px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
          }
          .confirm {
            background-color: red;
            color: white;
          }
          .cancel {
            background-color: lightgray;
            color: black;
          }
        </style>
      </head>
      <body>
        <header class="app-header">
          <div class="header-title">SafeNotes</div>
          <div class="header-subtitle">Share. Secure. Self-Destruct.</div>
        </header>
        <div class="note-view-container">
          <h1>Read and destroy?</h1>
          <p>You're about to read and destroy the note with id <strong>${note._id}</strong>.</p>
          <button class="button confirm" onclick="confirmNote()">Yes, show me the note</button>
          <button class="button cancel" onclick="cancel()">No, not now</button>
        </div>
        <script>
          function confirmNote() {
            window.location.href = '/api/note/${note._id}/read';
          }
          function cancel() {
            window.location.href = "/";
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error retrieving note:', error.message);
    res.status(500).send('<h1>Error retrieving note</h1>');
  }
});



// GET route to read and destroy the note
app.get('/api/note/:id/read', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).send('<h1>Note not found</h1>');
    }

    const decryptedContent = decrypt(note.content);

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Note Content</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            text-align: center;
          }

          .app-header {
            background-color: #3b5998; /* Blue background */
            color: white; /* White text */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 120px; /* Adjust height as needed */
            text-align: center;
          }

          .header-title {
            font-size: 2.5rem; /* Increase title font size */
            font-weight: bold;
            margin: 0;
          }

          .header-subtitle {
            font-size: 1.2rem; /* Adjust subtitle font size */
            font-style: italic;
            margin-top: 5px; /* Add spacing between title and subtitle */
          }

          .note-view-container {
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }

          .note-content {
            margin-top: 20px;
            padding: 20px;
            border: 1px solid #333;
            background-color: #fff7c0; /* Light yellow */
            border-radius: 5px;
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <header class="app-header">
          <div class="header-title">SafeNotes</div>
          <div class="header-subtitle">Share. Secure. Self-Destruct.</div>
        </header>
        <div class="note-view-container">
          <h1>Note Content</h1>
          <div class="note-content">${decryptedContent}</div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error reading and destroying note:', error.message);
    res.status(500).send('<h1>Error reading and destroying note</h1>');
  }
});


// DELETE route to destroy a note by its ID
app.delete('/api/note/:id', async (req, res) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }

    // Attempt to delete the note
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note destroyed successfully' });
  } catch (error) {
    console.error('Error destroying note:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
  console.log(`API Docs available at https://localhost:${port}/api-docs`);
});