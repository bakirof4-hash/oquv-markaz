const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register Student
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Bu email orqali allaqachon ro\'yxatdan o\'tilgan.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      fullname,
      email,
      password: hashedPassword,
      phone,
      role: 'student'
    });

    await user.save();

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Tizimda xatolik yuz berdi.', error: error.message });
  }
});

// Login User/Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email yoki parol xato.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email yoki parol xato.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Tizimda xatolik yuz berdi.', error: error.message });
  }
});

// Get Current User Info
router.get('/me', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    fullname: req.user.fullname,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role
  });
});

module.exports = router;
