// decorators
import { Passkey, Vault } from '@/decorators';

// facades
import { Provider } from '@/facades';

// types
import type { CreateProviderParameters } from '@/types';

// utilities
import { createLogger, documentTitle } from '@/utilities';

export default async function createProvider({ debug = false, user }: CreateProviderParameters): Promise<Provider> {
  const __logPrefix = 'createProvider';
  const logger = createLogger(debug ? 'debug' : 'error');
  const vault = await Vault.create({ logger });
  let passkey = await vault.passkey();

  if (!passkey) {
    logger.debug(`${__logPrefix}: passkey not found, registering new one`);

    passkey = await Passkey.register({
      client: {
        origin: window.origin,
        title: documentTitle(),
      },
      logger,
      user,
    });

    await vault.setPasskey(passkey);
  }

  return new Provider({
    logger,
    vault,
  });
}
