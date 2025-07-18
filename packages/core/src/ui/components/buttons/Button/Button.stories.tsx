import type { Meta, StoryObj } from '@storybook/preact';

// components
import Button from './Button';

// icons
import ArrowLeftIcon from '@/ui/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/ui/icons/ArrowRightIcon';

// types
import { Props } from './types';
import VStack from '@/ui/components/layouts/VStack';

const meta: Meta<Props> = {
  args: {
    children: 'Click me!',
    colorMode: 'dark',
  },
  globals: {
    theme: 'dark',
  },
  component: Button,
  title: 'Components/Buttons/Button',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Button {...props} colorMode={globals.theme} />,
};

export const WithDarkModeAndSecondaryVariant: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <Button {...props} colorMode={globals.theme} variant="secondary" />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <Button {...props} colorMode={globals.theme} />,
};

export const WithLightModeAndSecondaryVariant: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <Button {...props} colorMode={globals.theme} variant="secondary" />
  ),
};

export const WithLeftIcon: StoryObj<Props> = {
  render: (props, { globals }) => (
    <Button {...props} colorMode={globals.theme} leftIcon={<ArrowLeftIcon />}>
      Previous
    </Button>
  ),
};

export const WithRightIcon: StoryObj<Props> = {
  render: (props, { globals }) => (
    <Button {...props} colorMode={globals.theme} rightIcon={<ArrowRightIcon />}>
      Next
    </Button>
  ),
};

export const Disabled: StoryObj<Props> = {
  render: (props, { globals }) => (
    <Button {...props} colorMode={globals.theme} disabled={true}>
      Disabled
    </Button>
  ),
};

export const Sizes: StoryObj<Props> = {
  render: (props, { globals }) => (
    <VStack align="center" justify="center" spacing="sm">
      <Button {...props} colorMode={globals.theme} rightIcon={<ArrowRightIcon />} size="xs">
        Size Xs
      </Button>

      <Button {...props} colorMode={globals.theme} rightIcon={<ArrowRightIcon />} size="sm">
        Size Sm
      </Button>

      <Button {...props} colorMode={globals.theme} rightIcon={<ArrowRightIcon />} size="md">
        Size Md
      </Button>

      <Button {...props} colorMode={globals.theme} rightIcon={<ArrowRightIcon />} size="lg">
        Size Lg
      </Button>

      <Button {...props} colorMode={globals.theme} rightIcon={<ArrowRightIcon />} size="xl">
        Size Xl
      </Button>
    </VStack>

  ),
};

export default meta;
