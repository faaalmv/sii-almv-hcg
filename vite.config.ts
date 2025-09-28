import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Carga las variables de entorno de .env.local
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0', // Permite el acceso desde otras IPs en la red local si es necesario
      },
      plugins: [react()],
      define: {
        // Exponer la URL base del API a la aplicación React.
        'import.meta.env.VITE_API_URL_BASE': JSON.stringify(env.VITE_API_URL_BASE || 'http://localhost:8080/api/v1'),
      },
    };
});