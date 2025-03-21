import { isEqual } from '@agoralabs-sh/bytes';
import { generate } from '@agoralabs-sh/uuid';
import { bytesToHex, randomBytes } from '@noble/hashes/utils';
import { deleteDB } from 'idb';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

// constants
import { INITIALIZATION_VECTOR_BYTE_SIZE, SALT_BYTE_SIZE } from '@/constants';

// decorators
import VaultDecorator from './VaultDecorator';

// types
import { PrivateKey, Passkey, UserInformation } from '@/types';

// utilities
import { addressFromPrivateKey, createLogger, generatePrivateKey } from '@/utilities';

describe(VaultDecorator.displayName, () => {
  const logger = createLogger('silent');
  const user: UserInformation = {
    username: 'magnetartare',
  };
  let vault: VaultDecorator;

  afterEach(() => {
    vault.close();
  });

  beforeEach(async () => {
    if (vault) {
      await deleteDB(vault.name());
    }

    vault = await VaultDecorator.create({
      logger,
      user,
    });
  });

  describe('setPasskey()', () => {
    test('it should set a new passkey', async () => {
      const passkey: Passkey = {
        credentialID: generate(),
        salt: bytesToHex(randomBytes(SALT_BYTE_SIZE)),
        initializationVector: bytesToHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
        transports: [],
      };
      let _passkey: Passkey | null;

      await vault.setPasskey(passkey);

      _passkey = await vault.passkey();

      expect(_passkey).toEqual(passkey);
    });

    test('it replace an existing passkey', async () => {
      const passkey: Passkey = {
        credentialID: generate(),
        salt: bytesToHex(randomBytes(SALT_BYTE_SIZE)),
        initializationVector: bytesToHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
        transports: [],
      };
      let _passkey: Passkey | null;

      await vault.setPasskey({
        credentialID: generate(),
        salt: bytesToHex(randomBytes(SALT_BYTE_SIZE)),
        initializationVector: bytesToHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
        transports: [],
      });
      await vault.setPasskey(passkey);

      _passkey = await vault.passkey();

      expect(_passkey).toEqual(passkey);
    });
  });

  describe('upsertItem()', () => {
    test('it should add the new item', async () => {
      const item: PrivateKey = {
        keyData: generatePrivateKey(),
        name: 'Personal',
      };
      let _item: PrivateKey | null;
      let items = await vault.items();

      expect(items.size).toBe(0);

      await vault.upsertItems(new Map<string, PrivateKey>([[addressFromPrivateKey(item.keyData), item]]));

      items = await vault.items();
      _item = items.get(addressFromPrivateKey(item.keyData)) || null;

      expect(_item).toBeDefined();
      expect(isEqual(_item?.keyData ?? new Uint8Array(), item.keyData)).toBe(true);
      expect(_item?.name).toBe(item.name);
    });

    test('it should update an existing item', async () => {
      const item: PrivateKey = {
        keyData: generatePrivateKey(),
        name: 'Personal',
      };
      let _item: PrivateKey | null;
      let items: Map<string, PrivateKey>;

      await vault.upsertItems(
        new Map<string, PrivateKey>([
          [
            addressFromPrivateKey(item.keyData),
            {
              ...item,
              name: 'Old Personal',
            },
          ],
        ])
      );

      items = await vault.items();

      expect(items.size).toBe(1);

      await vault.upsertItems(new Map<string, PrivateKey>([[addressFromPrivateKey(item.keyData), item]]));

      items = await vault.items();
      _item = items.get(addressFromPrivateKey(item.keyData)) || null;

      expect(_item).toBeDefined();
      expect(isEqual(_item?.keyData ?? new Uint8Array(), item.keyData)).toBe(true);
      expect(_item?.name).toBe(item.name);
    });
  });
});
