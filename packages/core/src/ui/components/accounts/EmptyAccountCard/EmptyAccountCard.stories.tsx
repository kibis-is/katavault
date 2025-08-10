import type { Meta, StoryObj } from '@storybook/preact';

// components
import EmptyAccountCard from './EmptyAccountCard';

// icons
import PlusIcon from '@/ui/icons/PlusIcon';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    text: 'Connect an account',
  },
  component: EmptyAccountCard,
  title: 'Components/Accounts/EmptyAccountCard',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <EmptyAccountCard {...props} colorMode={globals.theme} />,
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <EmptyAccountCard {...props} colorMode={globals.theme} />,
};

export const WithIcon: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <EmptyAccountCard
      {...props}
      colorMode={globals.theme}
      icon={<PlusIcon />}
    />
  ),
};

export const WithIconAndClickHandler: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <EmptyAccountCard
      {...props}
      colorMode={globals.theme}
      icon={<PlusIcon />}
      onClick={() => console.log('clicked')}
    />
  ),
};

export default meta;
