import type { ILogger } from '@kibisis/utilities';
import { Katavault } from '@kibisis/katavault-core';

export default function onOpenVaultButtonClick(katavault: Katavault, logger: ILogger) {
  return async () => {
    const __logPrefix = 'onOpenVaultButtonClick';

    try {
      katavault.openVault();
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
    }
  };
}
