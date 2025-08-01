import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // resolutions needed for sass, typescript resolutions handled by the vite-tsconfig-paths plugin
      '@/styles': resolve(__dirname, 'src/styles'),
    },
  },
  server: {
    port: 8080,
  },
});
