import type { ILogger } from '@kibisis/utilities';
import type { i18n as I18n } from 'i18next';

// types
import type { Vault } from '@/types';

interface Props {
  i18n: I18n;
  logger: ILogger;
  vault: Vault;
}

export default Props;
