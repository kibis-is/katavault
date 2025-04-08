import { createContext } from 'react';

// types
import type { ContextState } from '@/types';

const KatavaultContext = createContext<ContextState>({
  timestamp: 0,
  onUpdate: null,
  wallet: null,
});

export default KatavaultContext;
