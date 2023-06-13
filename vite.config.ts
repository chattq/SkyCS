import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8082,
  },
  build: {
    rollupOptions: {
      treeshake: false
    }
  },
  resolve: {
    alias: {
      "devextreme/ui": 'devextreme/esm/ui'
    }
  },
  plugins: [
    react(
      {
        jsxRuntime: 'classic'
      }
    ), viteTsconfigPaths(), svgrPlugin()],
});