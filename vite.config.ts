import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";
import viteRewriteAll from "vite-plugin-rewrite-all";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
  },
  build: {
    rollupOptions: {
      treeshake: false,
    },
  },
  resolve: {
    alias: {
      "devextreme/ui": "devextreme/esm/ui",
    },
  },
  plugins: [
    viteRewriteAll(),
    react({
      jsxRuntime: "classic",
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
});
