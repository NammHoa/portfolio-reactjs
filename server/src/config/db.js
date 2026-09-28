import dns from 'node:dns'
import mongoose from 'mongoose'

// Node's own DNS resolver sometimes fails SRV lookups (used by
// mongodb+srv:// URIs) on Windows even when the OS resolver works fine.
// Forcing a known-good resolver here avoids that mismatch.
dns.setServers(['8.8.8.8', '1.1.1.1'])

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}
