import type { Meta, StoryObj } from '@storybook/preact';

// components
import CopyIconButton from './CopyIconButton';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    text: 'Copied to clipboard!'
  },
  component: CopyIconButton,
  title: 'Components/Buttons/CopyIconButton',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <CopyIconButton {...props} colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <CopyIconButton {...props} colorMode={globals.theme} />
  ),
};

export default meta;
