import { describe, expect, test } from 'vitest';

// decorators
import AVMWebProviderConnector from './AVMWebProviderConnector';

// enums
import { ConnectorIDEnum } from '@/enums';

// mocks
import chain from '@test/mocks/chain';

describe(AVMWebProviderConnector.displayName, () => {
  describe('id()', () => {
    test('should get the id', () => {
      expect(
        new AVMWebProviderConnector({
          supportedChains: [chain],
        }).id()
      ).toBe(ConnectorIDEnum.AVMWebProvider);
    });
  });
});
