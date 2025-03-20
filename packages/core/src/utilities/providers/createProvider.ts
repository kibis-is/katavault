// decorators
import { Vault } from '@/decorators';

// facades
import { Provider } from '@/facades';

// types
import type { CreateProviderParameters } from '@/types';

// utilities
import { createLogger } from '@/utilities';

export default async function createProvider({ debug = false }: CreateProviderParameters): Promise<Provider> {
  const logger = createLogger(debug ? 'debug' : 'error');
  const vault = await Vault.create({ logger });

  return new Provider({
    logger,
    vault,
  });
}
