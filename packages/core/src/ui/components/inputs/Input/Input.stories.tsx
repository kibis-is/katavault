import type { Meta, StoryObj } from '@storybook/preact';

// components
import IconButton from '@/ui/components/buttons/IconButton';
import Input from './Input';
import VStack from '@/ui/components/layouts/VStack';

// icons
import ArrowRightIcon from '@/ui/icons/ArrowRightIcon';

// hooks
import useInput from '@/ui/hooks/forms/useInput';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    placeholder: 'Enter a username',
  },
  globals: {
    theme: 'dark',
  },
  component: Input,
  decorators: [
    (Story, { args }) => {
      const inputProps = useInput({
        name: 'Username',
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
  title: 'Components/Inputs/Input',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Input {...props} colorMode={globals.theme} />,
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <Input {...props} colorMode={globals.theme} />,
};

export const WithLabel: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props) => <Input
    {...props}
    label="Username"
  />,
};

export const WithError: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props) => <Input
    {...props}
    error="This field is required"
  />,
};

export const WithHint: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props) => <Input
    {...props}
    hint="Use a strong password"
  />,
};

export const WithRightButton: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Input
    {...props}
    rightButton={(
      <IconButton colorMode={globals.theme} icon={<ArrowRightIcon />} />
    )}
  />,
};

export const WithEverything: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Input
    {...props}
    error="This field is required"
    hint="Use a strong password"
    label="Username"
    required={true}
    rightButton={(
      <IconButton colorMode={globals.theme} icon={<ArrowRightIcon />} />
    )}
  />,
};

export default meta;
