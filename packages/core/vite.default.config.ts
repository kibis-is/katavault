import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // resolutions needed for sass, typescript resolutions handled by the vite-tsconfig-paths plugin
      '@/ui/styles': resolve(__dirname, 'src/ui/styles'),
    },
  },
});
