import type { Chain } from '@kibisis/chains';

// types
import type { AuthenticationStore, Vault } from '@/types';

interface RenderWalletAppParameters {
  authenticationStore: AuthenticationStore;
  chains: Chain[];
  vault: Vault;
}

export default RenderWalletAppParameters;
