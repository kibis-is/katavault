import type { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/buttons/Button';
import CircularLoaderWithIcon from '@/ui/components/loaders/CircularLoaderWithIcon';
import ConnectionButton from '@/ui/components/buttons/ConnectionButton';
import Heading from '@/ui/components/typography/Heading';
import HStack from '@/ui/components/layouts/HStack';
import IconButton from '@/ui/components/buttons/IconButton';
import Modal from '@/ui/components/layouts/Modal';
import Spacer from '@/ui/components/layouts/Spacer';
import Stack from '@/ui/components/layouts/Stack';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// enums
import { ConnectorIDEnum } from '@/enums';

// hooks
import useAddAccounts from '@/ui/hooks/accounts/useAddAccount';
import useAvailableConnections from '@/ui/hooks/connectors/useAvailableConnections';
import useConnectors from '@/ui/hooks/connectors/useConnectors';
import useLogger from '@/ui/hooks/logging/useLogger';
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useTabletAndUp from '@/ui/hooks/screens/useTabletAndUp';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';
import WalletIcon from '@/ui/icons/WalletIcon';

// types
import type { ConnectedAccount, WalletConnection } from '@/types';
import type { StackProps } from '@/ui/types';
import type { Props } from './types';

const ConnectAccountModal: FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  // hooks
  const addAccounts = useAddAccounts();
  const availableConnections = useAvailableConnections();
  const connectors = useConnectors();
  const logger = useLogger();
  const colorMode = useSettingsColorMode();
  const tabletAndUp = useTabletAndUp();
  const translate = useTranslate();
  // states
  const [connection, setConnection] = useState<WalletConnection | null>(null);
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
  const handleOnConnectionClick = useCallback((connectorID: ConnectorIDEnum, connection: WalletConnection) => async () => {
    const __logPrefix = `${ConnectAccountModal.displayName}#handleOnConnectionClick`;
    const connector = connectors.find((_connector) => _connector.id() === connectorID) ?? null;
    let accounts: ConnectedAccount[];

    if (!connector) {
      logger?.error(`${__logPrefix} - connector not found`);

      return;
    }

    setConnection(connection);

    try {
      accounts = await connector.connect(connection.id);

      addAccounts(accounts);
      onClose();
    } catch (error) {
      logger?.error(`${__logPrefix} - `, error);
    } finally {
      setConnection(null);
    }

  }, [addAccounts, connectors, logger, onClose, setConnection]);

  return (
    <Modal
      colorMode={colorMode}
      body={connection ? (
        <VStack {...defaultBodyProps} align="center">
          <CircularLoaderWithIcon colorMode={colorMode} icon={<WalletIcon />} size="lg" />

          <Text colorMode={colorMode} fullWidth={true} textAlign="center">
            {translate('captions.connectingWallet', {
              name: connection.name,
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
            {availableConnections.map(({ connectorID, ...connection }, index) => (
              <ConnectionButton
                colorMode={colorMode}
                connection={connection}
                key={`${connection.id}-${index}`}
                onClick={handleOnConnectionClick(connectorID, connection)}
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

ConnectAccountModal.displayName = 'ConnectAccountModal';

export default ConnectAccountModal;
