// types
import type { UserInformation } from '@/types';
import type AuthenticationStore from './AuthenticationStore';

/**
 * @property {AuthenticationStore} authenticationStore - The authentication store that was used.
 * @property {UserInformation} user - The user information.
 */
interface AuthenticateResult {
  authenticationStore: AuthenticationStore;
  user: UserInformation;
}

export default AuthenticateResult;
