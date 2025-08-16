import type { Meta, StoryObj } from '@storybook/preact';

// components
import HStack from '@/ui/components/layouts/HStack';
import IconButton from './IconButton';

// icons
import CopyIcon from '@/ui/icons/CopyIcon';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    icon: <CopyIcon />,
  },
  component: IconButton,
  title: 'Components/Buttons/IconButton',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <IconButton {...props} colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <IconButton {...props} colorMode={globals.theme} />
  ),
};

export const Sizes: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <HStack align="center" fullWidth={true} spacing="xs">
      <IconButton {...props} colorMode={globals.theme} size="xs" />
      <IconButton {...props} colorMode={globals.theme} size="sm" />
      <IconButton {...props} colorMode={globals.theme} size="md" />
      <IconButton {...props} colorMode={globals.theme} size="lg" />
      <IconButton {...props} colorMode={globals.theme} size="xl" />
    </HStack>
  ),
};

export default meta;
