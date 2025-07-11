import type { ILogger } from '@kibisis/utilities';
import type { i18n as I18n } from 'i18next';

// decorators
import { ConfigStore } from '@/decorators';

interface AppState {
  configStore: ConfigStore;
  i18n: I18n;
  logger: ILogger;
}

export default AppState;
