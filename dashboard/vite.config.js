import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  preview: {
    port: 10000,
    host: '0.0.0.0',
    allowedHosts: ['container-yard-frontend.onrender.com']  // ✅ Add this line
  }
});