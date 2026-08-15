import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Flow is served from GitHub Pages under https://no-group.github.io/Flow.web/
// so the base path is "/Flow.web/". Change `base` (or set VITE_BASE) if you
// host elsewhere.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/Flow.web/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Accept the live-preview host so the sandbox can reach the app.
    allowedHosts: true,
  },
});
