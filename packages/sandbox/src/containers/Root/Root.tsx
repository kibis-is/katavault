import { Button as ChakraButton, HStack, Spacer, VStack } from '@chakra-ui/react';
import { useAuthenticate, useClearVault, useOpenVault } from '@kibisis/katavault-react';
import { Button, DEFAULT_GAP, Heading, IconButton, Text, useColorMode } from '@kibisis/react';
import { type FC, useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { LuMoon, LuSun } from 'react-icons/lu';

// hooks
import useLogger from '@/hooks/useLogger';

// modals
import SendTransactionsModal from '@/modals/SendTransactionsModal';

// types
import type { Props } from './types';

const Root: FC<Props> = ({ onToggleColorMode }) => {
  const { authenticate, isAuthenticated } = useAuthenticate();
  const clearVault = useClearVault();
  const openVault = useOpenVault();
  const colorMode = useColorMode();
  const logger = useLogger();
  // states
  const [sendTransactionsModalOpen, setSendTransactionsModalOpen] = useState<boolean>(false);
  // memos
  const minButtonWidth = useMemo(() => '350px', []);
  // callbacks
  const handleOnAuthenticateClick = useCallback(
    () =>
      authenticate({
        onError: (error) => logger?.error('failed to authenticate', error),
        onSuccess: () => logger?.success('successfully authenticated katavault'),
      }),
    [authenticate, logger]
  );
  const handleOnClearVaultClick = useCallback(
    () =>
      clearVault({
        onError: (error) => logger?.error('failed clear vault', error),
        onSuccess: () => logger?.success('successfully cleared vault'),
      }),
    [clearVault, logger]
  );
  const handleOnOpenVaultClick = useCallback(
    () =>
      openVault({
        onError: (error) => logger?.error('failed to open vault', error),
        onSuccess: () => logger?.success('successfully opened vault'),
      }),
    [logger, openVault]
  );
  const handleOnSendTransactionsClick = useCallback(
    () => setSendTransactionsModalOpen(true),
    [setSendTransactionsModalOpen]
  );
  const handleOnSendTransactionsClose = useCallback(
    () => setSendTransactionsModalOpen(false),
    [setSendTransactionsModalOpen]
  );

  return (
    <>
      <Helmet>
        <title>{__APP_TITLE__}</title>

        <meta name="description" content={__APP_DESCRIPTION__} />

        <body data-color-mode={colorMode} />
      </Helmet>

      {/*modals*/}
      <SendTransactionsModal onClose={handleOnSendTransactionsClose} open={sendTransactionsModalOpen} />

      {/*header*/}
      <HStack align="center" as="header" gap={1} justify="center" p={DEFAULT_GAP / 2} w="full">
        <Heading colorMode={colorMode} w="full">
          {__APP_TITLE__}
        </Heading>

        <Spacer />

        <HStack align="center" gap={1}>
          <IconButton colorMode={colorMode} icon={colorMode === 'dark' ? LuMoon : LuSun} onClick={onToggleColorMode} />
        </HStack>
      </HStack>

      {/*main*/}
      <VStack
        align="center"
        as="main"
        flexGrow={1}
        gap={DEFAULT_GAP * 2}
        justify="center"
        maxW="1024px"
        minW="400px"
        w="full"
      >
        {!isAuthenticated ? (
          <>
            <Text colorMode={colorMode}>Begin by logging in or signing up to the vault.</Text>
            {/*actions*/}
            <VStack align="center" gap={DEFAULT_GAP / 3} justify="center" minW={minButtonWidth}>
              <Button colorMode={colorMode} onClick={handleOnAuthenticateClick} w="full">
                Authenticate
              </Button>
            </VStack>
          </>
        ) : (
          <>
            <Text colorMode={colorMode}>You have been successfully authenticated.</Text>

            {/*actions*/}
            <VStack align="center" gap={DEFAULT_GAP / 3} justify="center" minW={minButtonWidth}>
              <Button colorMode={colorMode} onClick={handleOnOpenVaultClick} w="full">
                Open Vault
              </Button>

              <Button colorMode={colorMode} onClick={handleOnSendTransactionsClick} w="full">
                Send Transactions
              </Button>
            </VStack>

            <VStack
              borderColor="red.500"
              borderRadius="3xl"
              borderStyle="solid"
              borderWidth={1}
              align="center"
              gap={DEFAULT_GAP - 2}
              justify="center"
              p={DEFAULT_GAP - 2}
              maxW={minButtonWidth}
            >
              <Text color="red.500" fontSize="sm" textAlign="center">
                This will clear the database and any credentials, settings and account data.
              </Text>

              <ChakraButton borderRadius="3xl" colorPalette="red" onClick={handleOnClearVaultClick} w="full">
                Clear Vault
              </ChakraButton>
            </VStack>
          </>
        )}
      </VStack>

      {/*footer*/}
      <HStack align="center" as="footer" justify="center" p={DEFAULT_GAP / 3} w="full">
        <Text colorMode={colorMode} fontSize="xs">{`${__APP_TITLE__} v${__VERSION__}`}</Text>
      </HStack>
    </>
  );
};

export default Root;
