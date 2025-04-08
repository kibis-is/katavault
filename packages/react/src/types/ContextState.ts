import { Wallet } from '@kibisis/katavault-core';

interface ContextState {
  onUpdate: (() => void) | null;
  timestamp: number;
  wallet: Wallet | null;
}

export default ContextState;
