const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  details: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    required: true,
    default: 'code' // Name of the SVG type
  },
  badgeColor: {
    type: String,
    required: true,
    default: '#3b82f6'
  },
  level: {
    type: String,
    default: 'Boshlang\'ich'
  },
  lessons: {
    type: String,
    default: '24 ta'
  },
  lang: {
    type: String,
    default: 'O\'zbek tilida'
  },
  cert: {
    type: String,
    default: 'Mavjud'
  },
  mentorName: {
    type: String,
    required: true
  },
  mentorRole: {
    type: String,
    required: true
  },
  mentorExp: {
    type: String,
    required: true
  },
  mentorGrad: {
    type: String,
    required: true
  },
  mentorInitials: {
    type: String,
    required: true
  },
  modules: [moduleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
