import type { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/buttons/Button';
import CircularLoaderWithIcon from '@/ui/components/loaders/CircularLoaderWithIcon';
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
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useTabletAndUp from '@/ui/hooks/screens/useTabletAndUp';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import ArrowLeftRightIcon from '@/ui/icons/ArrowLeftRightIcon';
import CloseIcon from '@/ui/icons/CloseIcon';

// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem } from '@/types';
import type { StackProps } from '@/ui/types';
import type { Props } from './types';

const TransferModal: FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  // hooks
  const colorMode = useSettingsColorMode();
  const tabletAndUp = useTabletAndUp();
  const translate = useTranslate();
  // states
  const [recipient, setRecipient] = useState<ConnectedAccountStoreItem | EphemeralAccountStoreItem | null>(null);
  const [sender, setSender] = useState<ConnectedAccountStoreItem | EphemeralAccountStoreItem | null>(null);
  const [transferring, setTransferring] = useState<boolean>(false);
  // memos
  const defaultBodyProps = useMemo<Partial<StackProps>>(() => ({
    fullWidth: true,
    minHeight: 250,
    grow: true,
    paddingBottom: DEFAULT_PADDING,
    paddingX: DEFAULT_PADDING,
    spacing: 'md',
  }), []);
  // callbacks
  const handleOnTransferClick = useCallback(() => () => {
    console.log('start transfer');
  }, []);

  return (
    <Modal
      closeOnEscape={!transferring}
      closeOnInteractOutside={!transferring}
      colorMode={colorMode}
      body={false ? (
        <VStack {...defaultBodyProps} align="center">
          <CircularLoaderWithIcon colorMode={colorMode} icon={<ArrowLeftRightIcon />} size="lg" />

          <Text colorMode={colorMode} fullWidth={true} textAlign="center">
            {translate('captions.transferringFunds', {
              amount: '',
              sender: '',
              recipient: '',
            })}
          </Text>
        </VStack>
      ) : (
        <VStack{...defaultBodyProps} align={tabletAndUp ? 'start' : 'center'}>
          <Text colorMode={colorMode} textAlign={tabletAndUp ? 'left' : 'center'}>
            {translate('captions.chooseConnectionMethod')}
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
            onClick={handleOnTransferClick}
            rightIcon={<ArrowLeftRightIcon />}
          >
            {translate('buttons.transfer')}
          </Button>
        </HStack>
      )}
      header={(
        <HStack  align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {/*title*/}
          <Heading colorMode={colorMode} textAlign="left">
            {translate('headings.transferFunds')}
          </Heading>

          <Spacer />

          {/*close button*/}
          {!transferring && (
            <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={onClose} />
          )}
        </HStack>
      )}
      onClose={onClose}
      open={open}
    />
  );
};

export default TransferModal;
