
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      define: {
        'import.meta.env.VITE_API_URL_BASE': JSON.stringify(env.VITE_API_URL_BASE || 'http://localhost:8080/api/v1'),
      },
    };
});
