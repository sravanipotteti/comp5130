const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  encrypted: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    unique: true,
    required: true,
  },
  expiration: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
