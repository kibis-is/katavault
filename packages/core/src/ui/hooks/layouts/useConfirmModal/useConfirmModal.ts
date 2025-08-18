import { useContext } from 'preact/hooks';

// contexts
import { ConfirmModalContext } from '@/ui/contexts';

// types
import type { ConfirmParameters } from './types';

export default function useConfirmModal(): (parameters: ConfirmParameters) => void {
  // contexts
  const state = useContext(ConfirmModalContext);
  // callbacks
  return ({ message, onClose, onConfirm, title }: ConfirmParameters) => {
    if (!state) {
      return;
    }

    const { setMessage, setOnClose, setOnConfirm, setOpen, setTitle } = state;

    setMessage(message);
    setOnClose(onClose ?? null);
    setOnConfirm(onConfirm ?? null);
    setTitle(title);
    setOpen(true);
  };
}
