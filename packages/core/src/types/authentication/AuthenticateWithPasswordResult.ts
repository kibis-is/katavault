// enums
import { AuthenticationMethod } from '@/enums';

// types
import type { UserInformation } from '@/types';

/**
 * @property {string} password - The password used to encrypt the account private keys.
 * @property {UserInformation} user - The user information.
 */
interface AuthenticateWithPasswordResult {
  __type: AuthenticationMethod.Password;
  password: string;
  user: UserInformation;
}

export default AuthenticateWithPasswordResult;
