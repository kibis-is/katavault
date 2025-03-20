// types
import type { AccountWithPrivateKeyBytes, Logger } from '@/types';

interface ProviderParameters {
  accounts: [AccountWithPrivateKeyBytes, ...AccountWithPrivateKeyBytes[]];
  logger: Logger;
}

export default ProviderParameters;
