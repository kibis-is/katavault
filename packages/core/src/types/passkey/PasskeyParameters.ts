// types
import type { CommonParameters, Passkey } from '@/types';

interface PasskeyParameters extends CommonParameters {
  keyMaterial: Uint8Array;
  passkey: Passkey;
}

export default PasskeyParameters;
