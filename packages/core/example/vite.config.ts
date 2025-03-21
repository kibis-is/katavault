import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default (() => {
  const sdkDir = resolve(__dirname, '..', 'dist');

  return defineConfig({
    root: __dirname,
    resolve: {
      alias: {
        '@kibisis/embedded-wallet-sdk': sdkDir,
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
