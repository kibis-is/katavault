import { AVMWebClient } from '@agoralabs-sh/avm-web-provider';
import { createContext } from 'preact';

// types
import type { ContextValue } from '@/ui/types';

const ChainsContext = createContext<ContextValue<AVMWebClient>>({
  onUpdate: null,
  state: null,
  timestamp: 0,
});

export default ChainsContext;
