const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, admin } = require('../middleware/auth');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Kurslarni yuklashda xatolik yuz berdi.', error: error.message });
  }
});

// GET single course details
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Kurs topilmadi.' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Kursni yuklashda xatolik yuz berdi.', error: error.message });
  }
});

// POST add course (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Kurs qo\'shishda xatolik yuz berdi.', error: error.message });
  }
});

// PUT update course (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Kurs topilmadi.' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Kursni yangilashda xatolik yuz berdi.', error: error.message });
  }
});

// DELETE course (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Kurs topilmadi.' });
    }
    res.json({ message: 'Kurs muvaffaqiyatli o\'chirildi.' });
  } catch (error) {
    res.status(500).json({ message: 'Kursni o\'chirishda xatolik yuz berdi.', error: error.message });
  }
});

module.exports = router;
