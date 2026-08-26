import http from 'node:http';
import app from '../../src/app.js';

function request(path) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);

    server.listen(0, '127.0.0.1', async () => {
      try {
        const { port } = server.address();
        const response = await fetch(`http://127.0.0.1:${port}${path}`);
        const body = await response.json();
        server.close(() => resolve({ status: response.status, body }));
      } catch (error) {
        server.close(() => reject(error));
      }
    });
  });
}

describe('me API aliases', () => {
  test('GET /api/me/stats requires auth', async () => {
    const { status, body } = await request('/api/me/stats');
    expect(status).toBe(401);
    expect(body.code).toBe('AUTH_REQUIRED');
  });

  test('GET /api/dashboard/stats still works as an alias', async () => {
    const { status, body } = await request('/api/dashboard/stats');
    expect(status).toBe(401);
    expect(body.code).toBe('AUTH_REQUIRED');
  });
});
