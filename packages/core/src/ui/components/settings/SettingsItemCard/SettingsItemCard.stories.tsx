import type { Meta, StoryObj } from '@storybook/preact';

// components
import SettingsItemCard from './SettingsItemCard';
import Stack from '@/ui/components/layouts/Stack';
import Text from '@/ui/components/typography/Text';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    title: 'Version',
  },
  component: SettingsItemCard,
  title: 'Components/Settings/SettingsItemCard',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsItemCard
        {...props}
        colorMode={globals.theme}
        item={(
          <Text colorMode={globals.theme} fullWidth={true} size="sm" textAlign="right">
            {`1.0.0`}
          </Text>
        )}
      />
    </Stack>
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsItemCard
        {...props}
        colorMode={globals.theme}
        item={(
          <Text colorMode={globals.theme} fullWidth={true} size="sm" textAlign="right">
            {`1.0.0`}
          </Text>
        )}
      />
    </Stack>
  ),
};

export const WithSubtitle: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsItemCard
        {...props}
        colorMode={globals.theme}
        item={(
          <Text colorMode={globals.theme} fullWidth={true} size="sm" textAlign="right">
            {`1.0.0`}
          </Text>
        )}
        subtitle="The version of Katavault"
      />
    </Stack>
  ),
};

export const WithLongSubtitle: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Stack width={380}>
      <SettingsItemCard
        {...props}
        colorMode={globals.theme}
        item={(
          <Text colorMode={globals.theme} fullWidth={true} size="sm" textAlign="right">
            {`1.0.0`}
          </Text>
        )}
        subtitle="Realm of the galaxies vanquish the impossible venture cosmos hearts of the stars of brilliant syntheses. With pretty stories for which there's little good evidence decipherment extraordinary claims require extraordinary evidence across the centuries tendrils of gossamer clouds not a sunrise but a galaxyrise." />
    </Stack>
  ),
};

export default meta;
