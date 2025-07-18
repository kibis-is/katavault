import type { Meta, StoryObj } from '@storybook/preact';

// components
import PasswordInput from './PasswordInput';
import VStack from '@/ui/components/layouts/VStack';

// hooks
import useInput from '@/ui/hooks/forms/useInput';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
  },
  component: PasswordInput,
  decorators: [
    (Story, { args }) => {
      const inputProps = useInput({
        name: 'password',
      });

      return (
        <VStack align="center" justify="center" width={350}>
          {Story({
            args: {
              ...args,
              ...inputProps,
            },
          })}
        </VStack>
      );
    },
  ],
  title: 'Components/Inputs/PasswordInput',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <PasswordInput {...props} colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <PasswordInput {...props} colorMode={globals.theme} />
  ),
};

export default meta;
