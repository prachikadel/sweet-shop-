import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import sweetRoutes from './routes/sweets';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5174', 'http://localhost:3001', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🍬 Sweet Shop API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
}

export { app };