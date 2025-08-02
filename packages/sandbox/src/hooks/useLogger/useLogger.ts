import type { ILogger } from '@kibisis/utilities';
import { useContext } from 'react';

// contexts
import { LoggerContext } from '@/contexts';

export default function useLogger(): ILogger | null {
  return useContext(LoggerContext);
}
