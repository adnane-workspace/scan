import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env, clientOrigins } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { router } from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsPath = path.resolve(__dirname, '../uploads');

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(uploadsPath));
app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
