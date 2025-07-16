import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';
import type { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

// components
import Button from '@/ui/components/Button';
import ConnectorButton from '@/ui/components/connections/ConnectorButton';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Modal from '@/ui/components/Modal';
import Spacer from '@/ui/components/Spacer';
import Stack from '@/ui/components/Stack';
import Text from '@/ui/components/Text';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useAVMProviderDiscovery from '@/ui/hooks/connections/useAVMProviderDiscovery';
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useTabletAndUp from '@/ui/hooks/screens/useTabletAndUp';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';

// types
import type { Props } from './types';
import VStack from '@/ui/components/VStack';

const ConnectAccountModal: FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  // hooks
  const { connectors } = useAVMProviderDiscovery()
  const colorMode = useSettingsColorMode();
  const tabletAndUp = useTabletAndUp();
  const translate = useTranslate();
  // callbacks
  const handleOnConnectorClick = useCallback((connector: IDiscoverResult) => () => {
    console.log(`"${connector.name}" connector clicked!`);
  }, []);

  return (
    <Modal
      colorMode={colorMode}
      body={(
        <VStack
          align={tabletAndUp ? 'start' : 'center'}
          fullWidth={true}
          paddingBottom={DEFAULT_PADDING}
          paddingX={DEFAULT_PADDING}
          spacing="md"
        >
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
          <Button colorMode={colorMode} fullWidth={true} onClick={onClose}>
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
