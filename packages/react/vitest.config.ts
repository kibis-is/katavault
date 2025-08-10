import { defineConfig, mergeConfig } from 'vitest/config';

// configs
import defaultConfig from './vite.default.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      dir: 'src',
      passWithNoTests: true,
      setupFiles: ['fake-indexeddb/auto'],
      testTimeout: 60000,
      watch: false,
    },
  })
);
