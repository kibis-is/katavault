import type { Meta, StoryObj } from '@storybook/preact';

// modals
import SettingsModal from './SettingsModal';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    onClose: () => {},
    open: true,
  },
  component: SettingsModal,
  title: 'Modals/SettingsModal',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <SettingsModal {...props} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <SettingsModal {...props} />
  ),
};

export default meta;
