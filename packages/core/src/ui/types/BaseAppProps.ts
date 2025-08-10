import type { ILogger } from '@kibisis/utilities';
import type { i18n as I18n } from 'i18next';

// types
import type { ClientInformation } from '@/types';

interface BaseAppProps {
  clientInformation: ClientInformation;
  debug?: boolean;
  i18n: I18n;
  logger: ILogger;
  onClose: () => void;
}

export default BaseAppProps;
