import type { ILogger } from '@kibisis/utilities';
import type { i18n as I18n } from 'i18next';

// types
import type { Vault } from '@/types';

interface BaseAppProps {
  i18n: I18n;
  logger: ILogger;
  onClose: () => void;
  vault: Vault;
}

export default BaseAppProps;
