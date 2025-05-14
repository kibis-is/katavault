// decorators
import { PasskeyVaultDecorator, PasswordVaultDecorator } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

// errors
import { FailedToInitializeError, PasskeyNotSupportedError } from '@/errors';

// facades
import { Katavault } from '@/facades';

// types
import type {
  AuthenticationClient,
  ClientInformation,
  CreateKatavaultParameters,
  CreateKatavaultParametersWithPassword,
} from '@/types';

// utilities
import { createLogger, documentTitle, faviconURL } from '@/utilities';

/**
 * Creates an instance of Katavault.
 * @param {CreateKatavaultParameters | CreateKatavaultParametersWithPassword} params - client information, user
 * information and an optional password.
 * @throws {DecryptionError} If the stored challenge failed to be decrypted.
 * @throws {InvalidPasswordError} If supplied password does not match the stored password.
 * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
 * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
 * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
 * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
 */
export default async function createKatavault(
  params: CreateKatavaultParameters | CreateKatavaultParametersWithPassword
): Promise<Katavault> {
  const logger = createLogger(params.debug ? 'debug' : 'error');
  const client: ClientInformation = {
    host: window.location.hostname,
    icon: params.client?.icon || faviconURL() || undefined,
    name: params.client?.name ?? documentTitle(),
  };
  let authenticationClient: AuthenticationClient | null = null;

  // if a password is supplied, use password authentication
  if ((params as CreateKatavaultParametersWithPassword).password) {
    authenticationClient = {
      __type: AuthenticationMethod.Password,
      vault: await PasswordVaultDecorator.initialize({
        logger,
        password: (params as CreateKatavaultParametersWithPassword).password,
        user: params.user,
      }),
    };
  }

  if (!(params as CreateKatavaultParametersWithPassword).password) {
    if (!PasskeyVaultDecorator.isSupported()) {
      throw new PasskeyNotSupportedError('passkey not supported');
    }

    authenticationClient = {
      __type: AuthenticationMethod.Passkey,
      vault: await PasskeyVaultDecorator.initialize({
        client,
        logger,
        user: params.user,
      }),
    };
  }

  if (!authenticationClient) {
    throw new FailedToInitializeError('failed to initialize with an authentication method');
  }

  return await Katavault.initialize({
    authenticationClient: authenticationClient,
    logger,
    user: params.user,
  });
}
