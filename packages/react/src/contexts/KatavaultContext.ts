import { createContext } from 'react';

// types
import type { ContextState } from '@/types';

const KatavaultContext = createContext<ContextState>({
  timestamp: 0,
  onUpdate: null,
  katavault: null,
});

export default KatavaultContext;
