const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  exp: {
    type: String,
    required: true,
    trim: true
  },
  grad: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    trim: true
  },
  socials: {
    linkedin: { type: String, default: '' },
    telegram: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Instructor', instructorSchema);
