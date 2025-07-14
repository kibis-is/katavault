import { algorandTestnet, voiTestnet } from '@kibisis/chains';
import { ed25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@noble/hashes/utils';
import type { Meta, StoryObj } from '@storybook/preact';

// enums
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';

// components
import AccountCard from './AccountCard';

// types
import { Props } from './types';

// utilities
import { bytesToBase58, bytesToBase64 } from '@/utilities';

const meta: Meta<Props> = {
  args: {
    account: (() => {
      const privateKey = ed25519.utils.randomPrivateKey();

      return {
        __type: AccountTypeEnum.Ephemeral,
        credentialID: bytesToBase64(randomBytes(64)),
        key: bytesToBase58(ed25519.getPublicKey(privateKey)),
        keyData: bytesToBase64(privateKey),
        name: 'Personal',
        origin: EphemeralAccountOriginEnum.Credential,
      };
    })(),
    chains: [algorandTestnet, voiTestnet],
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

export const AccountWithNoName: StoryObj<Props> = {
  render: (props, { globals }) => (
    <AccountCard
      {...props}
      account={{
        ...props.account,
        name: undefined,
      }}
      colorMode={globals.theme}
    />
  ),
};

export const WithConnectedAccount: StoryObj<Props> = {
  render: (props, { globals }) => (
    <AccountCard
      {...props}
      account={{
        __type: AccountTypeEnum.Connected,
        key: props.account.key,
        name: props.account.name,
      }}
      colorMode={globals.theme}
    />
  ),
};

export default meta;
