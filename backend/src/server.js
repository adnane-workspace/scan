import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import app from './app.js';

export default app;

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    console.error('Check DATABASE_URL in backend/.env and make sure Postgres is running.');

    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }

    console.warn('Starting API without database in development mode.');
  }

  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`API running on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
