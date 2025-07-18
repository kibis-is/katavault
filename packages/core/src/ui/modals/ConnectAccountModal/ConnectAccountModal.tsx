import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';
import { base58 } from '@kibisis/encoding';
import type { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

// components
import Button from '@/ui/components/Button';
import CircularLoaderWithIcon from '@/ui/components/CircularLoaderWithIcon';
import ConnectorButton from '@/ui/components/connections/ConnectorButton';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Modal from '@/ui/components/Modal';
import Spacer from '@/ui/components/Spacer';
import Stack from '@/ui/components/Stack';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// decorators
import AVMAddress from '@/decorators/avm/AVMAddress';

// enums
import { AccountTypeEnum } from '@/enums';

// hooks
import useAddAccounts from '@/ui/hooks/accounts/useAddAccount';
import useAVMWebProviderConnect from '@/ui/hooks/connections/useAVMWebProviderConnect';
import useAVMProviderDiscovery from '@/ui/hooks/connections/useAVMProviderDiscovery';
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useTabletAndUp from '@/ui/hooks/screens/useTabletAndUp';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';
import WalletIcon from '@/ui/icons/WalletIcon';

// types
import type { StackProps } from '@/ui/types';
import type { Props } from './types';

const ConnectAccountModal: FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  // hooks
  const addAccounts = useAddAccounts();
  const {
    connector,
    connect,
  } = useAVMWebProviderConnect();
  const { connectors } = useAVMProviderDiscovery();
  const colorMode = useSettingsColorMode();
  const tabletAndUp = useTabletAndUp();
  const translate = useTranslate();
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
  const handleOnConnectorClick = useCallback((_connector: IDiscoverResult) => () => {
    connect({
      connector: _connector,
      onError: (error) => {
        console.error(error);
      },
      onSuccess: ({ accounts }) => {
        addAccounts(accounts.map(({ address, name }) => ({
          __type: AccountTypeEnum.Connected,
          connectors: [{
            icon: _connector.icon,
            id: _connector.providerId,
            name: _connector.name,
            host: _connector.host,
          }],
          key: base58.encode(AVMAddress.fromAddress(address).publicKey()),
          name,
        })));
        onClose();
      },
    });
  }, [addAccounts, connect, onClose]);

  return (
    <Modal
      colorMode={colorMode}
      body={connector ? (
        <VStack {...defaultBodyProps} align="center">
          <CircularLoaderWithIcon colorMode={colorMode} icon={<WalletIcon />} size="lg" />

          <Text colorMode={colorMode} fullWidth={true} textAlign="center">
            {translate('captions.connectingWallet', {
              name: connector.name,
            })}
          </Text>
        </VStack>
      ) : (
        <VStack{...defaultBodyProps} align={tabletAndUp ? 'start' : 'center'}>
          <Text colorMode={colorMode} textAlign={tabletAndUp ? 'left' : 'center'}>
            {translate('captions.chooseConnectionMethod')}
          </Text>

          <Stack
            align="center"
            direction={tabletAndUp ? 'horizontal' : 'vertical'}
            fullWidth={true}
            justify="center"
            spacing="sm"
          >
            {connectors.map((connector) => (
              <ConnectorButton
                colorMode={colorMode}
                connector={connector}
                key={connector.providerId}
                onClick={handleOnConnectorClick(connector)}
              />
            ))}
          </Stack>
        </VStack>
      )}
      footer={(
        <HStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING} spacing="xs">
          <Button colorMode={colorMode} fullWidth={true} onClick={onClose} variant="secondary">
            {translate('buttons.cancel')}
          </Button>
        </HStack>
      )}
      header={(
        <HStack  align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {/*title*/}
          <Heading colorMode={colorMode} textAlign="left">
            {translate('headings.connectAnAccount')}
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
