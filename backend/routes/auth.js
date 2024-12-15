const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    if (!username || !email || !password) {
      console.error('Validation error: Missing fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const user = new User({ username, email, password }); // No need to hash again
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /register route:', error.message); // Log backend errors
    res.status(400).json({ error: error.message || 'User registration failed' });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Log entered and stored passwords for debugging
      //console.log('Entered Password:', password); // Plaintext password entered by user
      //console.log('Stored Hashed Password:', user.password); // Hashed password from database
  
      // Compare entered password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      console.log('Password match result:', isMatch); // Log password comparison result
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

module.exports = router;
