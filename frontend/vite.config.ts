import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/prometheus': {
        target: 'http://127.0.0.1:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prometheus/, ''),
      },
      '/loki': {
        target: 'http://127.0.0.1:3100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/loki/, ''),
      },
    },
  },
});
