import type { Chain } from '@kibisis/chains';

// types
import type { AuthenticationStore, Vault } from '@/types';

interface RenderVaultAppParameters {
  authenticationStore: AuthenticationStore;
  chains: Chain[];
  vault: Vault;
}

export default RenderVaultAppParameters;
