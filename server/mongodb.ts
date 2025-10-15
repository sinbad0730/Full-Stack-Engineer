import mongoose from 'mongoose';

// Use MongoDB connection string, fallback to in-memory if none available
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/space-portfolio';

export async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});