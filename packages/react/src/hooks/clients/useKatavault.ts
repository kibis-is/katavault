import { Katavault } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the Katavault instance.
 *
 * @returns {Katavault | null} The Katavault instance or null if it has not been initialized.
 */
export default function useKatavault(): Katavault | null {
  return useContext(KatavaultContext).katavault;
}
