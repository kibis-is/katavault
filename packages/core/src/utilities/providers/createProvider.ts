import { isEqual as isBytesEqual } from '@agoralabs-sh/bytes';
import { ed25519 } from '@noble/curves/ed25519';
import { hexToBytes } from '@noble/hashes/utils';
import { seedFromMnemonic as privateKeyFromMnemonic } from 'algosdk';

// constants
import { ED21559_KEY_LENGTH } from '@/constants';

// facades
import { Provider } from '@/facades';

// types
import type { AccountWithPrivateKeyBytes, CreateProviderParameters } from '@/types';

// utilities
import { createLogger, isValidMnemonic } from '@/utilities';

export default function createProvider(
  { accounts, debug }: CreateProviderParameters = {
    debug: false,
  }
): Provider {
  const logger = createLogger(debug ? 'debug' : 'error');
  let _accounts: AccountWithPrivateKeyBytes[] = [];

  if (accounts) {
    _accounts = accounts.reduce<AccountWithPrivateKeyBytes[]>((acc, { name, seed }) => {
      let privateKey: Uint8Array;

      // if the mnemonic is valid, convert it to a 32-byte private key
      if (isValidMnemonic(seed)) {
        privateKey = privateKeyFromMnemonic(seed);

        return [
          ...acc,
          ...(!acc.find((value) => isBytesEqual(value.privateKey, privateKey)) ? [{ name, privateKey }] : []),
        ];
      }

      try {
        privateKey = hexToBytes(seed);

        // if the key is 32-byes, we can use it as a private key
        if (privateKey.length === ED21559_KEY_LENGTH) {
          return [
            ...acc,
            ...(!acc.find((value) => isBytesEqual(value.privateKey, privateKey)) ? [{ name, privateKey }] : []),
          ];
        }
      } catch (_) {}

      return acc;
    }, []);
  }

  // if there are no keys, generate a new one
  if (_accounts.length <= 0) {
    _accounts.push({
      privateKey: ed25519.utils.randomPrivateKey(),
    });
  }

  return new Provider({
    accounts: _accounts as [AccountWithPrivateKeyBytes, ...AccountWithPrivateKeyBytes[]],
    logger,
  });
}
