import type { ILogger } from '@kibisis/utilities';

// decorators
import { ConfigStore } from '@/decorators';

interface AppState {
  configStore: ConfigStore;
  logger: ILogger;
}

export default AppState;
