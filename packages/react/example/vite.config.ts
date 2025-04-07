import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default (() => {
  const sdkDir = resolve(__dirname, '..', 'dist');

  return defineConfig({
    build: {
      rollupOptions: {
        external: ['react', 'react/jsx-runtime'],
      },
    },
    plugins: [react()],
    root: __dirname,
    resolve: {
      alias: {
        '@kibisis/katavault-react': sdkDir,
      },
    },
    server: {
      port: 8080,
      watch: {
        ignored: [`!${sdkDir}/**/*`],
      },
    },
  });
})();
