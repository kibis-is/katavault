import { CAIP002Namespace, type Chain } from '@kibisis/chains';
import { createLogger } from '@kibisis/utilities';

// facades
import Katavault from '@/Katavault';

// types
import type { CreateKatavaultParameters } from '@/types';

// utilities
import { documentTitle, faviconURL } from '@/utilities';

/**
 * Creates an instance of Katavault.
 *
 * @param {CreateKatavaultParameters} parameters - The input parameters.
 * @param {boolean} [parameters.debug] - Whether to log debug messages. Defaults to `false`.
 * @param {[ChainConstructor, ...ChainConstructor[]]} parameters.chains - A collection of chains.
 * @param {Omit<ClientInformation, 'host'>} [parameters.client] - The client's name and the icon URL.
 * @returns {Promise<Katavault>} A promise that resolves to an initialized instance of Katavault.
 */
export default async function createKatavault({
  debug = false,
  chains,
  client,
}: CreateKatavaultParameters): Promise<Katavault> {
  const __logPrefix = 'createKatavault';
  const logger = createLogger(debug ? 'debug' : 'error');
  let _chain: Chain;
  let _chains: Chain[] = [];

  // for each chain get the network parameters
  for (const chain of chains) {
    try {
      switch (chain.namespace) {
        case CAIP002Namespace.Algorand:
        case CAIP002Namespace.AVM:
          _chain = await chain.initialize();

          _chains.push(_chain);

          break;
        default:
          logger.error(`${__logPrefix}: chain "${chain.namespace}" not supported`);

          break;
      }
    } catch (error) {
      logger.error(`${__logPrefix}: failed to add chain "${chain.displayName}" - `, error);
    }
  }

  return new Katavault({
    chains: _chains,
    clientInformation: {
      hostname: window.location.hostname,
      icon: client?.icon || faviconURL() || undefined,
      name: client?.name ?? documentTitle(),
    },
    debug,
    logger,
  });
}
