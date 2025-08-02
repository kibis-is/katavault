import { HStack, Spacer, VStack } from '@chakra-ui/react';
import { useAuthenticate, useClearVault, useOpenVault } from '@kibisis/katavault-react';
import { Button, DEFAULT_GAP, Heading, IconButton, Text, useColorMode } from '@kibisis/react';
import { type FC, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { LuMoon, LuSun } from 'react-icons/lu';

// hooks
import useLogger from '@/hooks/useLogger';

// types
import type { Props } from './types';

const Root: FC<Props> = ({ onToggleColorMode }) => {
  const { authenticate, isAuthenticated } = useAuthenticate();
  const clearVault = useClearVault();
  const openVault = useOpenVault();
  const colorMode = useColorMode();
  const logger = useLogger();
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
    [authenticate, logger]
  );
  const handleOnOpenVaultClick = useCallback(
    () =>
      openVault({
        onError: (error) => logger?.error('failed to open vault', error),
        onSuccess: () => logger?.success('successfully opened vault'),
      }),
    [authenticate, logger]
  );

  return (
    <>
      <Helmet>
        <title>{__APP_TITLE__}</title>

        <meta name="description" content={__APP_DESCRIPTION__} />

        <body data-color-mode={colorMode} />
      </Helmet>

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
        gap={DEFAULT_GAP}
        justify="center"
        maxW="1024px"
        minW="400px"
        w="full"
      >
        {!isAuthenticated ? (
          <>
            <Text colorMode={colorMode}>Begin by logging in or signing up to the vault.</Text>
            {/*actions*/}
            <VStack align="center" gap={1} justify="center" minW="250px">
              <Button onClick={handleOnAuthenticateClick} w="full">
                Authenticate
              </Button>
            </VStack>
          </>
        ) : (
          <>
            <Text colorMode={colorMode}>You have been successfully authenticated.</Text>

            {/*actions*/}
            <VStack align="center" gap={1} justify="center" minW="250px">
              <Button onClick={handleOnOpenVaultClick} w="full">
                Open Vault
              </Button>
              <Button onClick={handleOnClearVaultClick} w="full">
                Clear Vault
              </Button>
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
