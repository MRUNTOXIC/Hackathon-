import mongoose from 'mongoose';
import dns from 'dns';

/**
 * IMPORTANT: In Next.js API Routes, we MUST import and register all models
 * during database connection to ensure they are available for population
 * and relationship queries.
 */
import './models/User';
import './models/Team';
import './models/Announcement';
import './models/InternetCredential';
import './models/Invitation';
import './models/Submission';
import './models/Attendance';
import './models/JudgeScore';
import './models/Admin';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Ensure SRV DNS lookups succeed for MongoDB Atlas
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e: any) {
    console.warn('Could not set DNS servers:', e && e.message);
  }

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

    console.log('Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`MongoDB connected: ${mongooseInstance.connection.host} (db: ${mongooseInstance.connection.name})`);
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
