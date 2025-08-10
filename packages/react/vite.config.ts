import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';

// configs
import defaultConfig from './vite.default.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    build: {
      lib: {
        entry: 'src/index.ts',
        formats: ['es'],
        fileName: 'index',
      },
      outDir: 'dist',
      rollupOptions: {
        external: ['react', 'react/jsx-runtime'],
      },
      sourcemap: true,
    },
    plugins: [
      dts({
        tsconfigPath: 'tsconfig.build.json',
      }),
    ],
  })
);
