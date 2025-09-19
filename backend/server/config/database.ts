import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🍃 MongoDB Disconnected');
  } catch (error) {
    console.error('Database disconnection error:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

