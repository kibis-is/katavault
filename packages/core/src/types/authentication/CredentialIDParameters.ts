// enums
import { AuthenticationMethodEnum } from '@/enums';

/**
 * @property {AuthenticationMethodEnum.Passkey} method - The authentication method: `passkey`.
 * @property {string} passkeyCredentialID - The passkey credential ID encoded with base64.
 */
interface PasskeyCredentialIDParameters {
  method: AuthenticationMethodEnum.Passkey;
  passkeyCredentialID: string;
}

/**
 * @property {AuthenticationMethodEnum.Passkey} method - The authentication method: `password`.
 * @property {string} password - The password encoded with UTF-8.
 */
interface PasswordCredentialIDParameters {
  method: AuthenticationMethodEnum.Password;
  password: string;
}

type CredentialIDParameters = PasskeyCredentialIDParameters | PasswordCredentialIDParameters;

export default CredentialIDParameters;
