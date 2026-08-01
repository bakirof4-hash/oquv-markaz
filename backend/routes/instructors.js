const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const { auth, admin } = require('../middleware/auth');

// GET all instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'O\'qituvchilarni yuklashda xatolik yuz berdi.', error: error.message });
  }
});

// GET single instructor
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'O\'qituvchini yuklashda xatolik yuz berdi.', error: error.message });
  }
});

// POST add instructor (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    res.status(400).json({ message: 'O\'qituvchini qo\'shishda xatolik yuz berdi.', error: error.message });
  }
});

// PUT update instructor (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!instructor) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(400).json({ message: 'O\'qituvchini yangilashda xatolik yuz berdi.', error: error.message });
  }
});

// DELETE instructor (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }
    res.json({ message: 'O\'qituvchi muvaffaqiyatli o\'chirildi.' });
  } catch (error) {
    res.status(500).json({ message: 'O\'qituvchini o\'chirishda xatolik yuz berdi.', error: error.message });
  }
});

module.exports = router;
