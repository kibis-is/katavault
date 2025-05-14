// decorators
import { VaultDecorator } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

// errors
import { FailedToInitializeError } from '@/errors';

// facades
import { Katavault } from '@/facades';

// types
import type {
  AuthenticationParameters,
  CreateKatavaultParametersWithPasskey,
  CreateKatavaultParametersWithPassword,
} from '@/types';

// utilities
import { createLogger, documentTitle, faviconURL } from '@/utilities';

export default async function createKatavault(
  params: CreateKatavaultParametersWithPasskey | CreateKatavaultParametersWithPassword
): Promise<Katavault> {
  const { debug, client } = params;
  const logger = createLogger(debug ? 'debug' : 'error');
  let authenticationInformation: AuthenticationParameters | null = null;
  let vault: VaultDecorator;

  if ((params as CreateKatavaultParametersWithPasskey).passkey) {
    authenticationInformation = {
      __type: AuthenticationMethod.Passkey,
      ...(params as CreateKatavaultParametersWithPasskey).passkey,
    };
  }

  if ((params as CreateKatavaultParametersWithPassword).password) {
    authenticationInformation = {
      __type: AuthenticationMethod.Password,
      password: (params as CreateKatavaultParametersWithPassword).password,
    };
  }

  if (!authenticationInformation) {
    throw new FailedToInitializeError('missing authentication method');
  }

  vault = await VaultDecorator.create({ auth: authenticationInformation, logger });

  return new Katavault({
    client: {
      host: window.location.hostname,
      icon: client?.icon || faviconURL() || undefined,
      name: client?.name ?? documentTitle(),
    },
    logger,
    vault,
  });
}
