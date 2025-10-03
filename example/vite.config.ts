import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      'react-modern-gantt': resolve(__dirname, '../src/index.ts'),
      'react-modern-gantt/dist/index.css': resolve(__dirname, '../src/styles/gantt.css'),
      '@': resolve(__dirname, '../src'),
    },
  },
  optimizeDeps: {
    exclude: ['react-modern-gantt'],
  },
});
