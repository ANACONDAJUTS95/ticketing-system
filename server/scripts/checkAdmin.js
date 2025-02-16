const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');

async function checkAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (admin) {
      console.log('Admin user exists:', {
        email: admin.email,
        createdAt: admin.createdAt
      });
    } else {
      console.log('No admin user found');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error checking admin:', err);
    process.exit(1);
  }
}

checkAdminUser(); 