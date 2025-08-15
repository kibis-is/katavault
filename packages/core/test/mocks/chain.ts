import { CAIP002Namespace, Chain, VoiTestnet } from '@kibisis/chains';

const chain: Chain = {
  ...VoiTestnet,
  chainID: () => 'avm:mufvzhECYAe3WaU075v0z4k1_SNUIuUPCyBTE-Z_08s',
  displayName: () => VoiTestnet.displayName,
  iconURI: () => VoiTestnet.iconURI,
  namespace: () => CAIP002Namespace.AVM,
  nativeCurrency: () => VoiTestnet.nativeCurrency,
  networkInformation: {
    feeSinkAddress: 'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
    genesisHash: 'mufvzhECYAe3WaU075v0z4k1/SNUIuUPCyBTE+Z/08s=',
    genesisID: 'voitest-v1.1',
  },
  reference: 'mufvzhECYAe3WaU075v0z4k1_SNUIuUPCyBTE-Z_08s',
  shortName: () => VoiTestnet.shortName,
  testnet: () => VoiTestnet.testnet,
  transports: () => VoiTestnet.transports,
};

export default chain;
