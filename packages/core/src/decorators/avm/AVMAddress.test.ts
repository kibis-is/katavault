import { describe, expect, test } from 'vitest';

// constants
import { INVALID_AVM_ADDRESS_ERROR } from '@/constants';

// decorators
import AVMAddress from './AVMAddress';

// errors
import { BaseError } from '@/errors';

describe(AVMAddress.displayName, () => {
  const address = 'E3BLJEHDU2BW4H7WKEYS3GEPMOZHUHI2GAY66MDEO2KA73IUDKKRSV2LHU';

  describe(`fromAddress()`, () => {
    test('should fail if it is not a valid encoding', () => {
      try {
        AVMAddress.fromAddress('not a valid address');
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_AVM_ADDRESS_ERROR);

        return;
      }

      throw new Error('should throw an invalid address error');
    });

    test('should fail if it is an invalid length (too short)', () => {
      try {
        AVMAddress.fromAddress('E3BLJEHDU2BW4H7WKEYS3GEPMOZHUHI2GAY66MDEO2KA73IUDKKRSV2LH'); // 35 bytes
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_AVM_ADDRESS_ERROR);

        return;
      }

      throw new Error('should throw an invalid address error');
    });

    test('should fail if it is an invalid length (too long)', () => {
      try {
        AVMAddress.fromAddress('E3BLJEHDU2BW4H7WKEYS3GEPMOZHUHI2GAY66MDEO2KA73IUDKKRSV2LHUP'); // 37 bytes
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_AVM_ADDRESS_ERROR);

        return;
      }

      throw new Error('should throw an invalid address error');
    });

    test('should successfully parse the address', () => {
      AVMAddress.fromAddress(address);
    });
  });

  describe('address()', () => {
    test('should get the address', () => {
      expect(AVMAddress.fromAddress(address).address()).toBe(address);
    });
  });
});
