import { base64, utf8 } from '@kibisis/encoding';
import { sha512 } from '@noble/hashes/sha512';

// constants
import { ACCOUNT_PASSKEY_CREDENTIAL_ID_PREFIX, ACCOUNT_PASSWORD_CREDENTIAL_ID_PREFIX } from '@/constants';

// enums
import { AuthenticationMethodEnum } from '@/enums';

// errors
import { AuthenticationMethodNotSupportedError } from '@/errors';

// types
import type { CredentialIDParameters } from '@/types';

/**
 * Generates a credential ID based on the authentication method.
 * * Passkeys: `passkey:base64(<SHA-512 of the credential ID>)`
 * * Passwords: `password:base64(<SHA-512 of the password>)`
 * @param {CredentialIDParameters} params - The parameters containing authentication method and credential details.
 * @return {string} The generated account credential ID specific to the authentication method.
 * @throws {AuthenticationMethodNotSupportedError} If the authentication method is not supported.
 */
export default function credentialID(params: CredentialIDParameters): string {
  switch (params.method) {
    case AuthenticationMethodEnum.Passkey:
      return `${ACCOUNT_PASSKEY_CREDENTIAL_ID_PREFIX}:${base64.encode(sha512(base64.decode(params.passkeyCredentialID)))}`;
    case AuthenticationMethodEnum.Password:
      return `${ACCOUNT_PASSWORD_CREDENTIAL_ID_PREFIX}:${base64.encode(sha512(utf8.decode(params.password)))}`;
    default:
      throw new AuthenticationMethodNotSupportedError(`invalid authentication method`);
  }
}
