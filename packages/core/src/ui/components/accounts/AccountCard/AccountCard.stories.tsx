import { base58, base64 } from '@kibisis/encoding';
import { ed25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@noble/hashes/utils';
import type { Meta, StoryObj } from '@storybook/preact';

// enums
import { AccountTypeEnum, ConnectorIDEnum, EphemeralAccountOriginEnum } from '@/enums';

// components
import AccountCard from './AccountCard';

// mocks
import chain from '@test/mocks/chain';
import connection from '@test/mocks/connection';

// types
import type { EphemeralAccountStoreItem } from '@/types';
import type { Props } from './types';

const meta: Meta<Props> = {
  args: {
    account: (() => {
      const privateKey = ed25519.utils.randomPrivateKey();

      return {
        __type: AccountTypeEnum.Ephemeral,
        balances: {
          [chain.chainID()]: {
            amount: '12670987',
            block: '123456789',
            lastUpdatedAt: new Date().getTime().toString(),
          },
        },
        credentialID: base64.encode(randomBytes(64)),
        key: base58.encode(ed25519.getPublicKey(privateKey)),
        keyData: base58.encode(privateKey),
        name: 'Personal',
        origin: EphemeralAccountOriginEnum.Credential,
      } satisfies EphemeralAccountStoreItem;
    })(),
    chains: [chain],
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
        connections: [{
          connectorID: ConnectorIDEnum.AVMWebProvider,
          createdAt: new Date().getTime() / 1000,
          lastUsedAt: new Date().getTime() / 1000,
          wallet: connection,
        }],
        key: props.account.key,
        name: props.account.name,
      }}
      colorMode={globals.theme}
    />
  ),
};

export default meta;
