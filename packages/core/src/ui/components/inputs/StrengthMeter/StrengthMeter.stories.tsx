import type { Meta, StoryObj } from '@storybook/preact';

// components
import StrengthMeter from './StrengthMeter';
import VStack from '@/ui/components/layouts/VStack';

// types
import type { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    score: 1,
  },
  component: StrengthMeter,
  decorators: [
    (Story) => (
      <VStack align="center" justify="center" width={350}>
        {Story()}
      </VStack>
    ),
  ],
  globals: {
    theme: 'dark',
  },
  title: 'Components/Inputs/StrengthMeter',
};

export const WithDarkTheme: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <StrengthMeter {...props} colorMode={globals.theme} />,
};

export const WithLightTheme: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <StrengthMeter {...props} colorMode={globals.theme} />,
};

export const WithHighestStrength: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },

  render: (props, { globals }) => <StrengthMeter {...props} colorMode={globals.theme} score={2} />,
};

export const WithLowestStrength: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },

  render: (props, { globals }) => <StrengthMeter {...props} colorMode={globals.theme} score={0} />,
};

export default meta;
