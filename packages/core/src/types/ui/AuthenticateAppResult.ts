// types
import type { AuthenticationStore, Vault } from '@/types';

/**
 * @property {AuthenticationStore} authenticationStore - The authentication store that was initialized.
 * @property {Vault} vault - The initialized vault.
 */
interface AuthenticateAppResult {
  authenticationStore: AuthenticationStore;
  vault: Vault;
}

export default AuthenticateAppResult;
