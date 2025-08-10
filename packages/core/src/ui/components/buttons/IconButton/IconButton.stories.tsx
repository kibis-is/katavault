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
  render: (props) => (
    <HStack align="center" fullWidth={true} spacing="xs">
      <IconButton {...props} size="xs" />
      <IconButton {...props} size="sm" />
      <IconButton {...props} size="md" />
      <IconButton {...props} size="lg" />
      <IconButton {...props} size="xl" />
    </HStack>
  ),
};

export default meta;
