// types
import type AppState from './AppState';

interface AppContextValue {
  onUpdate: (() => void) | null;
  state: AppState | null;
  timestamp: number;
}

export default AppContextValue;
