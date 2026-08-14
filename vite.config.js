import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Flow is served from GitHub Pages under https://no-group.github.io/flow/
// so the base path is "/flow/". Change `base` if you host elsewhere.
export default defineConfig({
  plugins: [react()],
  base: '/flow/',
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
