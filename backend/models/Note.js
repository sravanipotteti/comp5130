const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false, // Remove `required` here
    unique: true,
  },
  expiration: {
    type: Date,
    default: Date.now,
    expires: '1d', // Automatically deletes after 1 day
  },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
