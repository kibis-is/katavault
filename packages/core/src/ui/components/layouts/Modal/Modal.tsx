import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import type { KeyboardEvent } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// components
import VStack from '@/ui/components/layouts/VStack';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Modal: FunctionComponent<Props> = ({ body, closeOnEscape, closeOnInteractOutside, colorMode, footer, header, onClose, onCloseAnimationEnd, open }) => {
  // states
  const [_open, setOpen] = useState<boolean>(open);
  const [closing, setClosing] = useState<boolean>(false);
  // memos
  // callbacks
  const handleOnCloseClick = useCallback(() => onClose(), [onClose]);
  const handleOnKeyUp = useCallback(({ key }: KeyboardEvent<Document>) => {
    if (closeOnEscape && key === 'Escape') {

      return onClose();
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    document.addEventListener('keyup', handleOnKeyUp);

    return () => document.removeEventListener('keyup', handleOnKeyUp);
  }, []);
  useEffect(() => {
    if (!open && _open) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        setOpen(false);
        onCloseAnimationEnd?.();
      }, 300); // allow animation to run

      return;
    }

    setOpen(open);
  }, [open]);

  if (!_open) {
    return null;
  }

  return (
    <div className={clsx(styles.container)}>
      <div
        className={clsx(styles.overlay)}
        {...(closeOnInteractOutside && {
          onClick: handleOnCloseClick,
        })}
      />

      <div className={clsx(styles.modal, closing && styles.modalClose)} data-color-mode={colorMode}>
        {/*header*/}
        {header}

        {/*body*/}
        <VStack fullWidth={true} grow={true}>
          {body}
        </VStack>

        {/*footer*/}
        {footer && (
          <VStack fullWidth={true}>
            {footer}
          </VStack>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export default Modal;
