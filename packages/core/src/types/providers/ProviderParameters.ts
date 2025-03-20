// decorators
import { Vault } from '@/decorators';

// types
import type { CommonParameters } from '@/types';

interface ProviderParameters extends CommonParameters {
  vault: Vault;
}

export default ProviderParameters;
