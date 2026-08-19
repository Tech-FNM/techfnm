import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/image': {
          target: 'https://rpnaqrmquddupmxvvcjg.supabase.co/storage/v1/object/public',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/image/, '')
        },
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    },
  };
});
