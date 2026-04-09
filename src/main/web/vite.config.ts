import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dst',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/dst/events': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/users': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/cctvs': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/mobile': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/groups': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/organizations': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/departments': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/videos': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/address': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/disasterHistories': { target: 'http://localhost:22223', changeOrigin: true },
      '/dst/share': { target: 'http://localhost:22223', changeOrigin: true },
    },
  },
  build: {
    outDir: '../resources/static',
    emptyOutDir: true,
  },
});
