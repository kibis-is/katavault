import type { Meta, StoryObj } from '@storybook/preact';
import { useCallback, useState } from 'preact/hooks';

// components
import VStack from '@/ui/components/layouts/VStack';
import Switch from './Switch';

// types
import type { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
  },
  component: Switch,
  decorators: [
    (Story, { args }) => {
      // states
      const [checked, setChecked] = useState<boolean>(false);
      // callbacks
      const onChange = useCallback(() => setChecked(!checked), [checked, setChecked]);

      return Story({
        args: {
          ...args,
          checked,
          onChange,
        },
      });
    },
  ],
  globals: {
    theme: 'dark',
  },
  title: 'Components/Inputs/Switch',
};

export const WithDarkTheme: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Switch {...props} colorMode={globals.theme} />,
};

export const WithLightTheme: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <Switch {...props} colorMode={globals.theme} />,
};

export const Disabled: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Switch {...props} colorMode={globals.theme} disabled={true} />,
};

export const DisabledAndChecked: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Switch {...props} checked={true} colorMode={globals.theme} disabled={true} />,
};

export const Sizes: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <VStack align="center" fullWidth={true} spacing="xs">
      <Switch {...props} colorMode={globals.theme} size="xs" />
      <Switch {...props} colorMode={globals.theme} size="sm" />
      <Switch {...props} colorMode={globals.theme} size="md" />
      <Switch {...props} colorMode={globals.theme} size="lg" />
      <Switch {...props} colorMode={globals.theme} size="xl" />
    </VStack>
  ),
};

export default meta;
