import { isEqual } from '@agoralabs-sh/bytes';
import { hex } from '@kibisis/encoding';
import { secp256k1 } from '@noble/curves/secp256k1';
import { describe, expect, test } from 'vitest';

// utilities
import toValidSecp256k1PrivateKey from './toValidSecp256k1PrivateKey';

describe('toValidSecp256k1PrivateKey()', () => {
  test('should use the secp256k1 private key if it is already valid', async () => {
    const key = secp256k1.utils.randomPrivateKey();
    const validKey = toValidSecp256k1PrivateKey(key);

    expect(secp256k1.utils.isValidPrivateKey(validKey)).toBe(true);
    expect(isEqual(validKey, key)).toBe(true);
  });

  test('should create convert the key if it is not a valid secp256k1 key', async () => {
    const key = hex.decode('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    let validKey: Uint8Array;

    expect(secp256k1.utils.isValidPrivateKey(key)).toBe(false);

    validKey = toValidSecp256k1PrivateKey(key);

    expect(secp256k1.utils.isValidPrivateKey(validKey)).toBe(true);
    expect(isEqual(validKey, key)).toBe(false);
  });
});
