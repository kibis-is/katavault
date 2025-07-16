import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

// components
import AccountCard from '@/ui/components/AccountCard';
import Button from '@/ui/components/Button';
import EmptyAccountCard from '@/ui/components/EmptyAccountCard';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// enums
import { AccountTypeEnum } from '@/enums';

// hooks
import useAccounts from '@/ui/hooks/accounts/useAccounts';
import useChains from '@/ui/hooks/chains/useChains';
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useSettingsToggleColorMode from '@/ui/hooks/settings/useSettingsToggleColorMode';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import ArrowLeftRightIcon from '@/ui/icons/ArrowLeftRightIcon';
import MoonIcon from '@/ui/icons/MoonIcon';
import PlusIcon from '@/ui/icons/PlusIcon';
import SunnyIcon from '@/ui/icons/SunnyIcon';
import CloseIcon from '@/ui/icons/CloseIcon';

// modals
import ConnectAccountModal from '@/ui/modals/ConnectAccountModal';
import TransferFundsModal from '@/ui/modals/TransferFundsModal';

// styles
import styles from './styles.module.scss';

// types
import type { RootProps } from './types';

// utilities
import { usernameFromVault } from '@/utilities';

const Root: FunctionComponent<RootProps> = ({ onClose, vault }) => {
  // hooks
  const accounts = useAccounts();
  const chains = useChains();
  const colorMode = useSettingsColorMode();
  const translate = useTranslate();
  const toggleColorMode = useSettingsToggleColorMode();
  // states
  const [closing, setClosing] = useState<boolean>(false);
  const [connectAccountModalOpen, setConnectAccountModalOpen] = useState<boolean>(false);
  const [transferFundsModalOpen, setTransferFundsModalOpen] = useState<boolean>(false);
  // memos
  const connectedAccounts = useMemo(
    () => accounts.filter((account) => account.__type === AccountTypeEnum.Connected),
    [accounts]
  );
  const ephemeralAccounts = useMemo(
    () => accounts.filter((account) => account.__type === AccountTypeEnum.Ephemeral),
    [accounts]
  );
  const username = useMemo(() => usernameFromVault(vault), [vault]);
  // callbacks
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 300); // allow animation to finish
  }, [closing, onClose, setClosing]);
  const handleOnConnectAccountClick = useCallback(() => setConnectAccountModalOpen(true), [setConnectAccountModalOpen]);
  const handleOnConnectAccountModalClose = useCallback(() => setConnectAccountModalOpen(false), [setConnectAccountModalOpen]);
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);
  const handleOnTransferFundsClick = useCallback(() => setTransferFundsModalOpen(true), [setTransferFundsModalOpen]);
  const handleOnTransferFundsModalClose = useCallback(() => setTransferFundsModalOpen(false), [setTransferFundsModalOpen]);

  return (
    <>
      <ConnectAccountModal
        onClose={handleOnConnectAccountModalClose}
        open={connectAccountModalOpen}
      />
      <TransferFundsModal
        onClose={handleOnTransferFundsModalClose}
        open={transferFundsModalOpen}
      />

      <div className={clsx(styles.container)}>
        {/*overlay*/}
        <div className={clsx(styles.overlay)} onClick={handleClose} />

        {/*modal*/}
        <div className={clsx(styles.modal, closing && styles.modalClose)} data-color-mode={colorMode}>
          {/*header*/}
          <HStack align="center" fullWidth={true} paddingX={DEFAULT_PADDING} paddingTop={DEFAULT_PADDING} spacing="xs">
            <VStack fullHeight={true} justify="evenly" spacing="xs">
              {/*username*/}
              <Text bold={true} colorMode={colorMode} textAlign="left">
                {username}
              </Text>
            </VStack>

            <Spacer />

            <HStack align="center" justify="end" spacing="xs">
              {/*toggle color mode button*/}
              <IconButton
                colorMode={colorMode}
                icon={colorMode === 'dark' ? <MoonIcon /> : <SunnyIcon />}
                onClick={handleOnToggleColorModeClick}
              />

              {/*close button*/}
              <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={handleClose} />
            </HStack>
          </HStack>

          {/*actions*/}
          <VStack align="center" fullWidth={true} justify="center" paddingX={DEFAULT_PADDING} paddingTop={DEFAULT_PADDING} spacing="xs">
            <Button
              colorMode={colorMode}
              fullWidth={true}
              onClick={handleOnTransferFundsClick}
              rightIcon={<ArrowLeftRightIcon />}
              size="sm"
              variant="secondary"
            >
              {translate('buttons.transferFunds')}
            </Button>
          </VStack>

          <VStack fullWidth={true} grow={true} padding={DEFAULT_PADDING} spacing="md">
            {/*ephemeral accounts*/}
            <VStack fullWidth={true} justify="center" spacing="sm">
              <Heading colorMode={colorMode} size="sm" textAlign="left">
                {translate('headings.holdingAccounts')}
              </Heading>

              {/*accounts*/}
              <VStack fullWidth={true} spacing="xs">
                {ephemeralAccounts.map((account) => (
                  <AccountCard
                    account={account}
                    chains={chains}
                    colorMode={colorMode}
                    key={account.key}
                  />
                ))}
              </VStack>
            </VStack>

            {/*connected accounts*/}
            <VStack fullWidth={true} justify="center" spacing="sm">
              <HStack align="center" fullWidth={true} spacing="xs">
                <Heading colorMode={colorMode} size="sm" textAlign="left">
                  {translate('headings.connectedAccounts')}
                </Heading>

                <Spacer />

                {connectedAccounts.length > 0 && (
                  <IconButton
                    colorMode={colorMode}
                    icon={<PlusIcon />}
                    onClick={handleOnConnectAccountClick}
                    size="xs"
                    title={translate('captions.connectAnAccount')}
                  />
                )}
              </HStack>

              {/*accounts*/}
              <VStack fullWidth={true} spacing="xs">
                {connectedAccounts.length > 0 ? connectedAccounts.map((account) => (
                  <AccountCard
                    account={account}
                    chains={chains}
                    colorMode={colorMode}
                    key={account.key}
                  />
                )) : (
                  <EmptyAccountCard
                    colorMode={colorMode}
                    icon={<PlusIcon />}
                    onClick={handleOnConnectAccountClick}
                    text={translate('captions.connectAnAccount')}
                  />
                )}
              </VStack>
            </VStack>
          </VStack>
        </div>
      </div>
    </>
  );
};

export default Root;
