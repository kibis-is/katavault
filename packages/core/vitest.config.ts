import { defineConfig, mergeConfig } from 'vitest/config';

// configs
import commonConfig from './vite.common.config';

export default mergeConfig(
  commonConfig,
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
