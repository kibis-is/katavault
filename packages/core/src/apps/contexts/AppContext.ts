import { createContext } from 'preact';

// types
import type { AppContextValue } from '@/apps/types';

const AppContext = createContext<AppContextValue>({
  onUpdate: null,
  state: null,
  timestamp: 0,
});

export default AppContext;
