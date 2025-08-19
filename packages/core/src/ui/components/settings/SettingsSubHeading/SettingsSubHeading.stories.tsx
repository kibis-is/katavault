import type { Meta, StoryObj } from '@storybook/preact';

// components
import SettingsSubHeading from './SettingsSubHeading';

// icons
import PaletteIcon from '@/ui/icons/PaletteIcon';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    children: `Appearance`,
    colorMode: 'dark',
  },
  component: SettingsSubHeading,
  title: 'Components/Settings/SettingsSubHeading',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <SettingsSubHeading {...props} colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <SettingsSubHeading {...props} colorMode={globals.theme} />
  ),
};

export const WithIcon: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <SettingsSubHeading
      {...props}
      colorMode={globals.theme}
      icon={<PaletteIcon />}
    />
  ),
};

export default meta;
