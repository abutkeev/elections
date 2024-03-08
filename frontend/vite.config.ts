import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  const backendUrl = new URL(process.env.PROXY_TARGET || 'http://127.0.0.1:4000');
  const { TELEGRAM_BOT_ID } = process.env;

  return {
    plugins: [
      react(),
      legacy({
        targets: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all'],
      }),
      tsconfigPaths(),
      VitePWA({
        manifest: {
          name: 'Elections',
          short_name: 'Elections',
        },
      }),
    ],
    server: {
      proxy: {
        '/api/': {
          secure: false,
          target: backendUrl,
        },
        '/socket.io': {
          secure: false,
          target: backendUrl,
          ws: true,
        },
      },
    },
    define: {
      TELEGRAM_BOT_ID: JSON.stringify(TELEGRAM_BOT_ID),
    },
  };
});
