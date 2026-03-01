require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle_service_app';
connectDB(MONGO_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/services', require('./routes/services'));

// Seed default admin if none exist
const seedAdmin = async () => {
  try {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    const existing = await User.findOne({ username: adminUser });
    if (!existing) {
      const hashed = await bcrypt.hash(adminPass, 10);
      await User.create({ username: adminUser, password: hashed, role: 'admin' });
      console.log('Default admin created:', adminUser);
    } else {
      // ensure role is admin
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
      }
      console.log('Admin user exists');
    }
  } catch (err) {
    console.error('Error seeding admin', err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdmin();
});
