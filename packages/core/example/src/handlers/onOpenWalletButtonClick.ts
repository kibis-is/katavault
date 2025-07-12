import type { ILogger } from '@kibisis/utilities';
import { Katavault } from '@kibisis/katavault-core';

export default function onOpenWalletButtonClick(katavault: Katavault, logger: ILogger) {
  return async () => {
    const __logPrefix = 'onOpenWalletButtonClick';

    try {
      katavault.openWallet();
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
    }
  };
}
