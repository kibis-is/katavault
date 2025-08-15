import { createContext } from 'preact';

// decorators
import type { SettingsStore } from '@/decorators';

const SettingsContext = createContext<SettingsStore | null>(null);

export default SettingsContext;
