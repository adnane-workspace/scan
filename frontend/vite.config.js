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
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'leaflet', test: /node_modules[\\/]leaflet[\\/]/ },
            { name: 'qrcode', test: /node_modules[\\/]qrcode[\\/]/ },
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router(?:-dom)?)[\\/]/,
            },
          ],
        },
      },
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
