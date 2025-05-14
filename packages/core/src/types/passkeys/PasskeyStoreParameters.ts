// types
import type { StoreParameters } from '@/types';

interface PasskeyStoreParameters extends StoreParameters {
  keyMaterial: Uint8Array;
}

export default PasskeyStoreParameters;
