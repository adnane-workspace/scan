import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import app from './app.js';
import './models/index.js';

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Check MONGODB_URI in backend/.env and make sure MongoDB is running.');

    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }

    console.warn('Starting API without database in development mode.');
  }

  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });
}

startServer();
