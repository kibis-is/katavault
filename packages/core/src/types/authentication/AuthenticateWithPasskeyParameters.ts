// types
import type { UserInformation } from '@/types';

/**
 * @property {UserInformation} user - The user information.
 */
interface AuthenticateWithPasskeyParameters {
  user: UserInformation;
}

export default AuthenticateWithPasskeyParameters;
