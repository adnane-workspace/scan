import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import app from './app.js';

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

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`API running on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });

  function shutdown(signal) {
    console.log(`${signal} received, closing API`);
    server.close(() => {
      disconnectDatabase()
        .catch((error) => console.error('Prisma disconnect failed:', error.message))
        .finally(() => process.exit(0));
    });

    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
