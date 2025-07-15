import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

// components
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Modal: FunctionComponent<Props> = ({ body, closeButton, closeOnEscape, closeOnInteractOutside, colorMode, footer, header, onClose, open }) => {
  // states
  const [_open, setOpen] = useState<boolean>(open);
  const [closing, setClosing] = useState<boolean>(false);
  // memos
  // callbacks
  const handleOnCloseClick = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open && _open) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        setOpen(false);
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
        {(closeButton || header) && (
          <HStack align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
            {header}

            {/*close button*/}
            {closeButton && (
              <HStack align="center" fullWidth={true} justify="end">
                <IconButton
                  colorMode={colorMode}
                  icon={<CloseIcon />}
                  onClick={handleOnCloseClick}
                />
              </HStack>
            )}
          </HStack>
        )}

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
