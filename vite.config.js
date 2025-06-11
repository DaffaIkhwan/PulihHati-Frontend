import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

// PWA DISABLED - Service Worker was causing offline redirect issues
// This fixes the problem where users see "Anda Sedang Offline" during login

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // PWA disabled to fix offline issues
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
