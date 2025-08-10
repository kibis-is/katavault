import { createContext } from 'preact';

// decorators
import type { SettingsStore } from '@/decorators';

// types
import type { ContextValue } from '@/ui/types';

const SettingsContext = createContext<ContextValue<SettingsStore>>({
  onUpdate: null,
  state: null,
  timestamp: 0,
});

export default SettingsContext;
