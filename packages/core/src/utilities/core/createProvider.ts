import { isEqual as isBytesEqual } from '@agoralabs-sh/bytes';
import { ed25519 } from '@noble/curves/ed25519';
import { hexToBytes } from '@noble/hashes/utils';
import { seedFromMnemonic as privateKeyFromMnemonic } from 'algosdk';

// constants
import { ED21559_KEY_LENGTH } from '@/constants';

// facades
import { Provider } from '@/facades';

// types
import type { CreateProviderParameters } from '@/types';

// utilities
import { createLogger, isValidMnemonic } from '@/utilities';

export default function createProvider(
  { debug, seeds }: CreateProviderParameters = {
    debug: false,
  }
): Provider {
  const logger = createLogger(debug ? 'debug' : 'error');
  let keys: Uint8Array[] = [];

  if (seeds) {
    keys = seeds.reduce((acc, seed) => {
      let key: Uint8Array;

      // if the mnemonic is valid, convert it to a 32-byte private key
      if (isValidMnemonic(seed)) {
        key = privateKeyFromMnemonic(seed);

        return [...acc, ...(!acc.find((value) => isBytesEqual(value, key)) ? [key] : [])];
      }

      try {
        key = hexToBytes(seed);

        // if the key is 32-byes, we can use it as a private key
        if (key.length === ED21559_KEY_LENGTH) {
          return [...acc, ...(!acc.find((value) => isBytesEqual(value, key)) ? [key] : [])];
        }
      } catch (_) {}

      return acc;
    }, []);
  }

  // if there are no keys, generate a new one
  if (keys.length <= 0) {
    keys.push(ed25519.utils.randomPrivateKey());
  }

  return new Provider({
    keys: keys as [Uint8Array, ...Uint8Array[]],
    logger,
  });
}
