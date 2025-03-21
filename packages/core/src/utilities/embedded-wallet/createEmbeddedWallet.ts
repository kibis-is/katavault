// decorators
import { VaultDecorator } from '@/decorators';

// facades
import { EmbeddedWallet } from '@/facades';

// types
import type { CreateEmbeddedWalletParameters } from '@/types';

// utilities
import { createLogger, documentTitle, faviconURL } from '@/utilities';

export default async function createEmbeddedWallet({
  client,
  debug = false,
  user,
}: CreateEmbeddedWalletParameters): Promise<EmbeddedWallet> {
  const logger = createLogger(debug ? 'debug' : 'error');
  const vault = await VaultDecorator.create({ logger, user });

  return new EmbeddedWallet({
    client: {
      host: window.location.hostname,
      icon: client?.icon || faviconURL() || undefined,
      name: client?.name ?? documentTitle(),
    },
    logger,
    user,
    vault,
  });
}
