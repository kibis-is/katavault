import type { Meta, StoryObj } from '@storybook/preact';

// components
import ConnectionButton from './ConnectionButton';
import VStack from '@/ui/components/layouts/VStack';

// mocks
import connection from '@test/mocks/connection'

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    connection,
    onClick: () => {},
  },
  component: ConnectionButton,
  decorators: [
    (Story) => (
      <VStack align="center" fullWidth={true} justify="center" width={350}>
        {Story()}
      </VStack>
    ),
  ],
  title: 'Components/Connections/ConnectorButton',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <ConnectionButton {...props} colorMode={globals.theme} />,
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <ConnectionButton {...props} colorMode={globals.theme} />,
};

export const WithNoHost: StoryObj<Props> = {
  render: (props, { globals }) => <ConnectionButton
    {...props}
    colorMode={globals.theme}
    connection={{
      ...props.connection,
      host: undefined,
    }}
  />,
};

export default meta;
