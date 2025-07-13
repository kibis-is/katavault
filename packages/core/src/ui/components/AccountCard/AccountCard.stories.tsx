import { ed25519 } from '@noble/curves/ed25519';
import type { Meta, StoryObj } from '@storybook/preact';

// enums
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';

// components
import AccountCard from './AccountCard';

// types
import { Props } from './types';

// utilities
import { bytesToBase58 } from '@/utilities';

const meta: Meta<Props> = {
  args: {
    account: {
      __type: AccountTypeEnum.Ephemeral,
      key: bytesToBase58(ed25519.getPublicKey(ed25519.utils.randomPrivateKey())),
      name: 'Personal',
      origin: EphemeralAccountOriginEnum.Credential,
    },
    colorMode: 'dark',
  },
  component: AccountCard,
  title: 'Components/Accounts/AccountCard',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <AccountCard {...props} colorMode={globals.theme} />,
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <AccountCard {...props} colorMode={globals.theme} />,
};

export default meta;
