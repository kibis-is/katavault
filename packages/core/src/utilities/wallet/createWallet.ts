// decorators
import { VaultDecorator } from '@/decorators';

// facades
import { Wallet } from '@/facades';

// types
import type { CreateWalletParameters } from '@/types';

// utilities
import { createLogger, documentTitle, faviconURL } from '@/utilities';

export default async function createWallet({ client, debug = false, user }: CreateWalletParameters): Promise<Wallet> {
  const logger = createLogger(debug ? 'debug' : 'error');
  const vault = await VaultDecorator.create({ logger, user });

  return new Wallet({
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
