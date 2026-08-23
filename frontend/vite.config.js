import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const frontendDir = fileURLToPath(new URL('.', import.meta.url));
const workspaceRoot = path.resolve(frontendDir, '..');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      leaflet: path.resolve(workspaceRoot, 'node_modules/leaflet'),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [workspaceRoot],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
