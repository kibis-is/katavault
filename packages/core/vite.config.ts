import preact from '@preact/preset-vite';
import { defineConfig, mergeConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
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
      sourcemap: true,
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/ui/styles/global.scss";`, // include the global scss file in the library build
          api: 'modern-compiler',
        },
      },
    },
    plugins: [
      cssInjectedByJsPlugin(),
      dts({
        tsconfigPath: 'tsconfig.build.json',
      }),
      preact(),
    ],
  })
);
