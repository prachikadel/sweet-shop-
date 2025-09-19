const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define User schema (inline for seed script)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop';
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sweetshop.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@sweetshop.com');
      console.log('Password: admin123');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sweetshop.com',
      passwordHash,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@sweetshop.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('ID:', admin._id);

    await mongoose.disconnect();
    console.log('🍃 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();

