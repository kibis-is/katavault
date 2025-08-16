import { createLogger } from '@kibisis/utilities';
import { secp256k1 } from '@noble/curves/secp256k1';
import { beforeEach, describe, expect, test } from 'vitest';

// constants
import { NOT_AUTHENTICATED_ERROR } from '@/constants';

// decorators
import PasswordStore from './PasswordStore';

// errors
import { BaseError } from '@/errors';

// utilities
import { initializeVault } from '@/utilities';

describe(PasswordStore.displayName, () => {
  const hostname = 'kibis.is';
  const logger = createLogger('silent');
  const password = 'B5@🐉🚀7🦄Fs!🦄Zm🌸D2#🌈Qp'; // ≈ 157.5 bits of entropy
  const username = 'kibi';
  let store: PasswordStore;

  beforeEach(async () => {
    store = new PasswordStore({
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

    test('should derive a valid private key with a high entropy password', async () => {
      let privateKey: Uint8Array;

      // authenticate
      store.setPassword(password);

      privateKey = await store.derivePrivateKey();

      expect(secp256k1.utils.isValidPrivateKey(privateKey)).toBe(true);
    });
  });
});
