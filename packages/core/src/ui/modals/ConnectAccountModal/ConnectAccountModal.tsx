import type { FunctionComponent } from 'preact';

// components
import Button from '@/ui/components/Button';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Modal from '@/ui/components/Modal';
import Spacer from '@/ui/components/Spacer';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';

// types
import type { Props } from './types';

const ConnectAccountModal: FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  // hooks
  const colorMode = useSettingsColorMode();
  const translate = useTranslate();

  return (
    <Modal
      colorMode={colorMode}
      body={(
        <VStack align="center" fullWidth={true} justify="center" spacing="sm">
        </VStack>
      )}
      footer={(
        <HStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING} spacing="xs">
          <Button colorMode={colorMode} fullWidth={true} onClick={onClose}>
            {translate('buttons.cancel')}
          </Button>
        </HStack>
      )}
      header={(
        <HStack  align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {/*title*/}
          <Heading colorMode={colorMode} size="sm" textAlign="left">
            {translate('headings.selectAWallet')}
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

export default ConnectAccountModal;
