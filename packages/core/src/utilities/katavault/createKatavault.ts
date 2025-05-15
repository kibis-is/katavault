// facades
import { Katavault } from '@/facades';

// types
import type { CreateKatavaultParameters } from '@/types';

// utilities
import { createLogger, documentTitle, faviconURL } from '@/utilities';

/**
 * Creates an instance of Katavault.
 * @param {CreateKatavaultParameters} params - The client information and optional debug mode.
 * @returns {Katavault} An initialized instance of Katavault.
 */
export default function createKatavault({ debug = false, client }: CreateKatavaultParameters): Katavault {
  const logger = createLogger(debug ? 'debug' : 'error');

  return new Katavault({
    clientInformation: {
      host: window.location.hostname,
      icon: client?.icon || faviconURL() || undefined,
      name: client?.name ?? documentTitle(),
    },
    logger,
  });
}
