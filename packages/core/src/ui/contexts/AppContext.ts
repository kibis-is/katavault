import { createContext } from 'preact';

// types
import type { ContextValue, AppContextState } from '@/ui/types';

const AppContext = createContext<ContextValue<AppContextState>>({
  onUpdate: null,
  state: null,
  timestamp: 0,
});

export default AppContext;
