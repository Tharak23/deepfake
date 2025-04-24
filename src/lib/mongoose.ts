import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables!');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Verify that the URI looks like a valid MongoDB connection string
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  console.error('MongoDB URI does not appear to be in a valid format!');
  throw new Error('MongoDB URI must start with mongodb:// or mongodb+srv://');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10, // Adjust based on your app's needs
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of default 30
      connectTimeoutMS: 10000,
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connection established successfully');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      cached.promise = null;
      throw new Error(`Failed to connect to MongoDB: ${err.message}`);
    });
  } else {
    console.log('Using existing MongoDB connection promise');
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connection ready');
  } catch (e) {
    console.error('Error resolving MongoDB connection:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  cached.conn = null;
  cached.promise = null;
});

// Log successful reconnection
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

export default dbConnect; 