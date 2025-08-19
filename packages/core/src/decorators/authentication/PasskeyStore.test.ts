import { createLogger } from '@kibisis/utilities';
import { secp256k1 } from '@noble/curves/secp256k1';
import { randomBytes } from '@stablelib/random';
import { beforeEach, describe, expect, test } from 'vitest';

// constants
import { NOT_AUTHENTICATED_ERROR, PRIVATE_KEY_BYTE_LENGTH } from '@/constants';

// decorators
import PasskeyStore from './PasskeyStore';

// errors
import { BaseError } from '@/errors';

// utilities
import { initializeVault } from '@/utilities';

describe(PasskeyStore.displayName, () => {
  const hostname = 'kibis.is';
  const logger = createLogger('silent');
  const username = 'kibi';
  let store: PasskeyStore;

  beforeEach(async () => {
    store = new PasskeyStore({
      hostname,
      logger,
      username,
      vault: await initializeVault({
        logger,
        username,
      }),
    });
  });

  describe(`derivePrivateKey()`, () => {
    test('should throw an error if the store has not been authenticated', async () => {
      try {
        await store.derivePrivateKey();
      } catch (error) {
        expect((error as BaseError).isKatavaultError).toBe(true);
        expect((error as BaseError).type).toBe(NOT_AUTHENTICATED_ERROR);

        return;
      }

      throw new Error('should throw an not authenticated error');
    });

    test('should derive a valid private key from some random key material', async () => {
      let privateKey: Uint8Array;

      // authenticate
      store.setKeyMaterial(randomBytes(PRIVATE_KEY_BYTE_LENGTH));

      privateKey = await store.derivePrivateKey();

      expect(secp256k1.utils.isValidPrivateKey(privateKey)).toBe(true);
    });
  });
});
