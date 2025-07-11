import type { ILogger } from '@kibisis/utilities';
import type { i18n as I18n } from 'i18next';

// types
import type { ClientInformation, Vault } from '@/types';

interface Props {
  clientInformation: ClientInformation;
  i18n: I18n;
  logger: ILogger;
  vault: Vault;
}

export default Props;
