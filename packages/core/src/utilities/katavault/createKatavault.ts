// decorators
import { VaultDecorator } from '@/decorators';

// facades
import { Katavault } from '@/facades';

// types
import type { CreateKatavaultParameters } from '@/types';

// utilities
import { createLogger, documentTitle, faviconURL } from '@/utilities';

export default async function createKatavault({
  client,
  debug = false,
  user,
}: CreateKatavaultParameters): Promise<Katavault> {
  const logger = createLogger(debug ? 'debug' : 'error');
  const vault = await VaultDecorator.create({ logger, user });

  return new Katavault({
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
