import preact from '@preact/preset-vite';
import { defineConfig, mergeConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

// configs
import commonConfig from './vite.common.config';
import { resolve } from 'node:path';

export default mergeConfig(
  commonConfig,
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
          additionalData: `@use "@styles/global.scss";`, // include the global scss file in the library build
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
    resolve: {
      alias: {
        // resolutions needed for sass, typescript resolutions handled by the vite-tsconfig-paths plugin
        '@/apps/common/fonts': resolve(__dirname, 'src/apps/common/fonts'),
        '@/apps/common/styles': resolve(__dirname, 'src/apps/common/styles'),
      },
    },
  })
);
