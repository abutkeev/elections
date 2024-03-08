import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
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
