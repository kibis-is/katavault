import type { Meta, StoryObj } from '@storybook/preact';

// components
import HStack from '@/ui/components/layouts/HStack';
import CurrencyIcon from './CurrencyIcon';

// mocks
import chain from '@test/mocks/chain';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    chain,
  },
  component: CurrencyIcon,
  title: 'Components/Accounts/CurrencyIcon',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <CurrencyIcon {...props} colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <CurrencyIcon {...props} colorMode={globals.theme} />
  ),
};

export const Sizes: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props) => (
    <HStack align="center" fullWidth={true} spacing="xs">
      <CurrencyIcon {...props} size="xs" />
      <CurrencyIcon {...props} size="sm" />
      <CurrencyIcon {...props} size="md" />
      <CurrencyIcon {...props} size="lg" />
      <CurrencyIcon {...props} size="xl" />
    </HStack>
  ),
};

export default meta;
