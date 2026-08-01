const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { auth, admin } = require('../middleware/auth');

// POST send message (Public)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Ism, telefon va xabar kiritilishi shart.' });
    }

    const contact = new Contact({ name, phone, email, message });
    await contact.save();

    res.status(201).json({ message: 'Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.', contact });
  } catch (error) {
    res.status(500).json({ message: 'Xabar yuborishda xatolik yuz berdi.', error: error.message });
  }
});

// GET all contact messages (Admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Xabarlarni yuklashda xatolik yuz berdi.', error: error.message });
  }
});

// DELETE contact message (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Xabar topilmadi.' });
    }
    res.json({ message: 'Xabar o\'chirildi.' });
  } catch (error) {
    res.status(500).json({ message: 'Xabarni o\'chirishda xatolik yuz berdi.', error: error.message });
  }
});

module.exports = router;
