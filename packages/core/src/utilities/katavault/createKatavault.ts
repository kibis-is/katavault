import { type ChainWithNetworkParameters, networkParametersFromChain } from '@kibisis/chains';
import { createLogger } from '@kibisis/utilities';

// facades
import { Katavault } from '@/facades';

// types
import type { CreateKatavaultParameters } from '@/types';

// utilities
import { documentTitle, faviconURL } from '@/utilities';

/**
 * Creates an instance of Katavault.
 * @param {CreateKatavaultParameters} params - The client information and optional debug mode.
 * @returns {Promise<Katavault>} A promise that resolves to an initialized instance of Katavault.
 */
export default async function createKatavault({
  debug = false,
  chains,
  client,
}: CreateKatavaultParameters): Promise<Katavault> {
  const __logPrefix = 'createKatavault';
  const logger = createLogger(debug ? 'debug' : 'error');
  let _chains: ChainWithNetworkParameters[] = [];
  let _chain: ChainWithNetworkParameters;

  // for each chain get the network parameters
  for (const chain of chains) {
    try {
      _chain = await networkParametersFromChain(chain);

      _chains.push(_chain);
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
    logger,
  });
}
