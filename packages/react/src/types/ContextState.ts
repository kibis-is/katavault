import { Katavault } from '@kibisis/katavault-core';

interface ContextState {
  onUpdate: (() => void) | null;
  timestamp: number;
  katavault: Katavault | null;
}

export default ContextState;
