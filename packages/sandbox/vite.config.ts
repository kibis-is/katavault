import favicons from '@peterek/vite-plugin-favicons';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

// versions
import { description, version } from './package.json';

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
  define: {
    __APP_DESCRIPTION__: JSON.stringify(description),
    __APP_TITLE__: JSON.stringify('Katavault Sandbox'),
    __VERSION__: JSON.stringify(version),
  },
  plugins: [favicons(resolve(__dirname, 'favicon.svg')), react(), tsconfigPaths()],
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
