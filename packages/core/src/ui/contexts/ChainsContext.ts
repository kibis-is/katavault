import type { Chain } from '@kibisis/chains';
import { createContext } from 'preact';

// types
import type { ContextValue } from '@/ui/types';

const ChainsContext = createContext<ContextValue<Chain[]>>({
  onUpdate: null,
  state: null,
  timestamp: 0,
});

export default ChainsContext;
