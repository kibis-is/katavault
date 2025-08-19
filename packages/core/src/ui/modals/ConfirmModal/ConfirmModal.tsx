import type { FunctionComponent } from 'preact';

// components
import Button from '@/ui/components/buttons/Button';
import Heading from '@/ui/components/typography/Heading';
import HStack from '@/ui/components/layouts/HStack';
import IconButton from '@/ui/components/buttons/IconButton';
import Modal from '@/ui/components/layouts/Modal';
import Spacer from '@/ui/components/layouts/Spacer';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';

// types
import type { Props } from './types';

const ConfirmModal: FunctionComponent<Props> = ({
  closeOnEscape,
  closeOnInteractOutside,
  colorMode,
  message,
  onClose,
  onConfirm,
  open,
  title,
}) => {
  // hooks
  const translate = useTranslate();

  return (
    <Modal
      closeOnEscape={closeOnEscape}
      closeOnInteractOutside={closeOnInteractOutside}
      colorMode={colorMode}
      body={(
        <VStack align="center" fullWidth={true} grow={true} paddingBottom={DEFAULT_PADDING} paddingX={DEFAULT_PADDING}>
          <Text colorMode={colorMode} fullWidth={true} textAlign="justify">
            {message}
          </Text>
        </VStack>
      )}
      footer={(
        <HStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING} spacing="xs">
          <Button colorMode={colorMode} fullWidth={true} onClick={onClose} variant="secondary">
            {translate('buttons.cancel')}
          </Button>

          <Button
            colorMode={colorMode}
            fullWidth={true}
            onClick={onConfirm}
          >
            {translate('buttons.confirm')}
          </Button>
        </HStack>
      )}
      header={(
        <HStack  align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {/*title*/}
          <Heading colorMode={colorMode} textAlign="left">
            {title}
          </Heading>

          <Spacer />

          {/*close button*/}
          <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={onClose} />
        </HStack>
      )}
      onClose={onClose}
      open={open}
    />
  );
};

export default ConfirmModal;
