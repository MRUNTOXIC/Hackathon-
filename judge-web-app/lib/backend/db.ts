import mongoose from 'mongoose';
import dns from 'dns';

/**
 * Register models
 */
import './models/Team';
import './models/JudgeScore';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e: any) {}

  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!cached.promise) {
    if (!MONGO_URI) {
        throw new Error('Please define the MONGO_URI environment variable in .env.local');
    }

    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGO_DB || 'hackathonDB',
      serverSelectionTimeoutMS: 15000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
