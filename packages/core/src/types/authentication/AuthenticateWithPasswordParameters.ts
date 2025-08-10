// types
import type { UserInformation } from '@/types';

/**
 * @property {string} password - The password used to encrypt the account private keys.
 * @property {UserInformation} user - The user information.
 */
interface AuthenticateWithPasswordParameters {
  password: string;
  user: UserInformation;
}

export default AuthenticateWithPasswordParameters;
