import { bytesToHex } from '@noble/hashes/utils';
import { describe, expect, test } from 'vitest';

// utilities
import { addressFromPrivateKey, generatePrivateKey, mnemonicFromPrivateKey } from '@/utilities';
import createProvider from './createProvider';

describe('createProvider', () => {
  describe('parameters.seeds', () => {
    test('should create a provider with at least one account if no seeds are specified', () => {
      const provider = createProvider();

      expect(provider.addresses().length).least(1);
    });

    test('should create a provider with a randomly generated account if the seed is not valid', () => {
      const provider = createProvider({
        accounts: [
          {
            seed: 'not a valid seed',
          },
        ],
      });

      expect(provider.addresses().length).least(1);
    });

    test('should create a provider with a mnemonic seed', () => {
      const privateKey = generatePrivateKey();
      const provider = createProvider({
        accounts: [
          {
            seed: mnemonicFromPrivateKey(privateKey),
          },
        ],
      });

      expect(provider.addresses()[0]).toBe(addressFromPrivateKey(privateKey));
    });

    test('should create a provider with a hexadecimal encoded private key seed', () => {
      const privateKey = generatePrivateKey();
      const provider = createProvider({
        accounts: [
          {
            seed: bytesToHex(privateKey),
          },
        ],
      });

      expect(provider.addresses()[0]).toBe(addressFromPrivateKey(privateKey));
    });

    test('should create a provider with a mixed seeds', () => {
      const privateKeys = Array.from({ length: 4 }, () => generatePrivateKey());
      const provider = createProvider({
        accounts: [
          {
            seed: bytesToHex(privateKeys[0]),
          },
          {
            seed: mnemonicFromPrivateKey(privateKeys[1]),
          },
          {
            seed: mnemonicFromPrivateKey(privateKeys[2]),
          },
          {
            seed: bytesToHex(privateKeys[3]),
          },
        ],
      });

      provider.addresses().forEach((address, index) => expect(address).toBe(addressFromPrivateKey(privateKeys[index])));
    });

    test('should create a provider with unique accounts from duplicate seeds', () => {
      const privateKey = generatePrivateKey();
      const provider = createProvider({
        accounts: [
          {
            seed: bytesToHex(privateKey),
          },
          {
            seed: mnemonicFromPrivateKey(privateKey),
          },
          {
            seed: bytesToHex(privateKey),
          },
        ],
      });

      expect(provider.addresses().length).toBe(1);
      expect(provider.addresses()[0]).toBe(addressFromPrivateKey(privateKey));
    });
  });
});
