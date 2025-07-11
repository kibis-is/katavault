import type { ILogger } from '@kibisis/utilities';

// types
import type { Vault } from '@/types';

interface BaseAppProps {
  logger: ILogger;
  onClose: () => void;
  vault: Vault;
}

export default BaseAppProps;
