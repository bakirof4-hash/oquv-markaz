const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Avtorizatsiya talab etiladi.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Foydalanuvchi topilmadi.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token yaroqsiz yoki muddati o\'tgan.' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Ruxsat etilmadi. Faqat adminlar uchun.' });
  }
};

module.exports = { auth, admin };
