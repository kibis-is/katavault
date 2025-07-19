import { CAIP002Namespace, VoiTestnet } from '@kibisis/chains';
import { base58, base64 } from '@kibisis/encoding';
import { ed25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@noble/hashes/utils';
import type { Meta, StoryObj } from '@storybook/preact';

// enums
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';

// components
import AccountCard from './AccountCard';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    account: (() => {
      const privateKey = ed25519.utils.randomPrivateKey();

      return {
        __type: AccountTypeEnum.Ephemeral,
        credentialID: base64.encode(randomBytes(64)),
        key: base58.encode(ed25519.getPublicKey(privateKey)),
        keyData: base58.encode(privateKey),
        name: 'Personal',
        origin: EphemeralAccountOriginEnum.Credential,
      };
    })(),
    chains: [
      {
        ...VoiTestnet,
        chainID: () => 'avm:mufvzhECYAe3WaU075v0z4k1_SNUIuUPCyBTE-Z_08s',
        namespace: () => CAIP002Namespace.AVM,
        networkConfiguration: () => VoiTestnet.networkConfiguration,
        networkInformation: {
          feeSinkAddress: 'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
          genesisHash: 'mufvzhECYAe3WaU075v0z4k1/SNUIuUPCyBTE+Z/08s=',
          genesisID: 'voitest-v1.1',
        },
        reference: 'mufvzhECYAe3WaU075v0z4k1_SNUIuUPCyBTE-Z_08s',
        displayName: () => VoiTestnet.displayName,
        iconURI: () => VoiTestnet.iconURI,
        nativeCurrency: () => VoiTestnet.nativeCurrency,
        testnet: () => VoiTestnet.testnet,
      },
    ],
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
  render: (props, { globals, parameters }) => (
    <AccountCard
      {...props}
      account={{
        __type: AccountTypeEnum.Connected,
        connectors: [parameters.connector],
        key: props.account.key,
        name: props.account.name,
      }}
      colorMode={globals.theme}
    />
  ),
};

export default meta;
