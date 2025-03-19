// types
import type { Logger } from '@/types';

interface ProviderParameters {
  logger: Logger;
  keys: [Uint8Array, ...Uint8Array[]];
}

export default ProviderParameters;
