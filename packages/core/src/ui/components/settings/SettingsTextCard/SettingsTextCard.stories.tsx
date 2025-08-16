import type { Meta, StoryObj } from '@storybook/preact';

// components
import SettingsTextCard from './SettingsTextCard';
import Stack from '@/ui/components/layouts/Stack';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    title: 'Version',
    value: '1.0.0',
  },
  component: SettingsTextCard,
  title: 'Components/Settings/SettingsTextCard',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Stack width={350}>
      <SettingsTextCard {...props} colorMode={globals.theme} />
    </Stack>
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsTextCard {...props} colorMode={globals.theme} />
    </Stack>
  ),
};

export const WithSubtitle: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsTextCard {...props} colorMode={globals.theme} subtitle="The version of Katavault" />
    </Stack>
  ),
};

export const WithLongSubtitle: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsTextCard {...props} colorMode={globals.theme} subtitle="Realm of the galaxies vanquish the impossible venture cosmos hearts of the stars of brilliant syntheses. With pretty stories for which there's little good evidence decipherment extraordinary claims require extraordinary evidence across the centuries tendrils of gossamer clouds not a sunrise but a galaxyrise." />
    </Stack>
  ),
};

export default meta;
