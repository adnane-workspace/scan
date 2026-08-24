import { ApiError } from '../utils/ApiError.js';

const windows = new Map();
const MAX_KEYS = 5000;

function clientKey(req) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  return `${req.method}:${req.path}:${ip}`;
}

function prune(now) {
  for (const [key, entry] of windows) {
    if (entry.resetAt <= now) {
      windows.delete(key);
    }
  }
}

export function rateLimit({ windowMs, max, message }) {
  return (req, res, next) => {
    const now = Date.now();

    if (windows.size > MAX_KEYS) {
      prune(now);
    }

    const key = clientKey(req);
    let entry = windows.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      windows.set(key, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      return next(new ApiError(429, message || 'Too many requests'));
    }

    return next();
  };
}
