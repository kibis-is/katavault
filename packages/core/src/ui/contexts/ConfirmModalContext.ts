import { createContext } from 'preact';

// types
import type { ConfirmModalContextState } from '@/ui/types';

const ConfirmModalContext = createContext<ConfirmModalContextState | null>(null);

export default ConfirmModalContext;
