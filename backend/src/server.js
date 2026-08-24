import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import app from './app.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function applyPendingMigrations() {
  console.log('Applying database migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: backendRoot,
    env: process.env,
  });
}

async function startServer() {
  try {
    if (env.NODE_ENV === 'production') {
      applyPendingMigrations();
    }

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

export default app;
