// types
import type { CommonParameters, Vault } from '@/types';

interface StoreParameters extends CommonParameters {
  vault: Vault;
}

export default StoreParameters;
