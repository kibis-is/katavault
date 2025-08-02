import { HStack, Spacer, VStack } from '@chakra-ui/react';
import { Button, DEFAULT_GAP, Heading, IconButton, Text, useColorMode } from '@kibisis/react';
import { type FC, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { LuMoon, LuSun } from 'react-icons/lu';

// types
import type { Props } from './types';

const Root: FC<Props> = ({ onToggleColorMode }) => {
  const colorMode = useColorMode();
  // memos
  const title = useMemo(() => 'Katavault Demo', []);
  // callbacks
  const handleOnAuthenticateClick = useCallback(() => console.log('authenticate!!'), []);

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta
          name="description"
          content="This is a demo that explores the features of Katavault from the perspective of a dApp."
        />

        <body data-color-mode={colorMode} />
      </Helmet>

      {/*header*/}
      <HStack align="center" as="header" gap={1} justify="center" p={DEFAULT_GAP / 2} w="full">
        <Heading colorMode={colorMode} w="full">
          {title}
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
        <Text colorMode={colorMode}>Begin by logging in or signing up to the vault.</Text>

        <Button onClick={handleOnAuthenticateClick}>Authenticate</Button>
      </VStack>

      {/*footer*/}
      <HStack align="center" as="footer" justify="center" p={DEFAULT_GAP / 3} w="full">
        <Text colorMode={colorMode} fontSize="xs">{`Demo Version ${__VERSION__}`}</Text>
      </HStack>
    </>
  );
};

export default Root;
