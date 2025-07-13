import type { StorybookConfig } from '@storybook/preact-vite';
import { mergeConfig } from 'vite';

// configs
import defaultConfig from '../vite.default.config';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-themes',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
  staticDirs: ['../src/ui/fonts'],
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  viteFinal: (config) => mergeConfig(defaultConfig, config),
};

export default config;
