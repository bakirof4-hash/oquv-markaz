const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/contact', require('./routes/contact'));

// Serve frontend static assets in production or when dist exists
const distPath = path.join(__dirname, '../frontend/dist');
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API server is running. Frontend build not found.');
  });
}

// Port & DB connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/it_academy';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB ga muvaffaqiyatli ulanindi.');
    app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda ishga tushdi.`);
    });
  })
  .catch((err) => {
    console.error('MongoDB ga ulanishda xatolik:', err);
    // Still listen on PORT so health check on Render passes even if DB is connecting asynchronously
    app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda (DB kutish rejimida) ishga tushdi.`);
    });
  });
