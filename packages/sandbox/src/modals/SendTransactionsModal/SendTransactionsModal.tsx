import { HStack, Spacer, VStack } from '@chakra-ui/react';
import { Heading, Modal, Text, useColorMode } from '@kibisis/react';
import {} from 'algosdk';
import { type FC, useCallback } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

// hooks
import useLogger from '@/hooks/useLogger';

// types
import type { ModalProps } from '@/types';

const SendTransactionsModal: FC<ModalProps> = ({ onClose, open }) => {
  const colorMode = useColorMode();
  const logger = useLogger();
  // callbacks
  const handleOnClose = useCallback(() => onClose(), []);

  return (
    <Modal
      body={
        <VStack>
          <Text>{`Send transactions to signed, effortlessly by the holding account.`}</Text>
        </VStack>
      }
      closeButton={true}
      colorMode={colorMode}
      header={
        <HStack gap={1} w="full">
          <Heading>Send Transactions</Heading>
        </HStack>
      }
      onClose={handleOnClose}
      open={open}
    />
  );
};

export default SendTransactionsModal;
