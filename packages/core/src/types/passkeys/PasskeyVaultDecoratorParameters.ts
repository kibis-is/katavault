// types
import type { VaultDecoratorParameters } from '@/types';

interface PasskeyVaultDecoratorParameters extends VaultDecoratorParameters {
  keyMaterial: Uint8Array;
}

export default PasskeyVaultDecoratorParameters;
