import type { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import type { PropsWithChildren } from 'preact/compat';

// contexts
import { ConfirmModalContext } from '@/ui/contexts';

const ConfirmModalProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // states
  const [message, setMessage] = useState<string>('');
  const [onClose, setOnClose] = useState<(() => void) | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  // callbacks
  const reset = useCallback(() => {
    setMessage('');
    setOnClose(null);
    setOnConfirm(null);
    setOpen(false);
    setTitle('');
  }, [setMessage, setOnClose, setOnConfirm, setOpen, setTitle]);

  return (
    <ConfirmModalContext.Provider
      value={{
        message,
        open,
        reset,
        setMessage,
        setOnClose,
        setOnConfirm,
        setOpen,
        setTitle,
        title,
        ...(onClose && { onClose }),
        ...(onConfirm && { onConfirm }),
      }}
    >
      {children}
    </ConfirmModalContext.Provider>
  );
};

export default ConfirmModalProvider;
