import { describe, expect, test } from 'vitest';

// constants
import { INVALID_CONNECTOR_ERROR } from '@/constants';

// decorators
import AVMWebProviderConnector from './AVMWebProviderConnector';

// enums
import { ConnectorIDEnum } from '@/enums';

// errors
import { BaseError } from '@/errors';

// mocks
import chain from '@test/mocks/chain';
import connection from '@test/mocks/connection';

// types
import type { SerializedConnector, WalletConnection } from '@/types';

describe(AVMWebProviderConnector.displayName, () => {
  const connections: WalletConnection[] = [
    {
      ...connection,
      createdAt: new Date().getTime() / 1000,
      lastUsedAt: new Date().getTime() / 1000,
    },
  ];

  describe('fromJSON()', () => {
    test('should throw an error if the wrong connector class is used', () => {
      try {
        AVMWebProviderConnector.fromJSON({
          connector: {
            connections,
            id: ConnectorIDEnum.Reown,
          },
          supportedChains: [chain],
        });
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_CONNECTOR_ERROR);

        return;
      }

      throw new Error('should throw an invalid connector error');
    });

    test('should create the connector', () => {
      const connector = AVMWebProviderConnector.fromJSON({
        connector: {
          connections,
          id: ConnectorIDEnum.AVMWebProvider,
        },
        supportedChains: [chain],
      });

      expect(connector.id()).toBe(ConnectorIDEnum.AVMWebProvider);
    });
  });

  describe('id()', () => {
    test('should get the id', () => {
      expect(
        new AVMWebProviderConnector({
          connections,
          supportedChains: [chain],
        }).id()
      ).toBe(ConnectorIDEnum.AVMWebProvider);
    });
  });

  describe('toJSON()', () => {
    test('should serialize the JSON', () => {
      const serializedConnector: SerializedConnector = {
        connections,
        id: ConnectorIDEnum.AVMWebProvider,
      };
      const connector = AVMWebProviderConnector.fromJSON({
        connector: serializedConnector,
        supportedChains: [chain],
      });

      expect(connector.toJSON()).toEqual(serializedConnector);
    });
  });
});
