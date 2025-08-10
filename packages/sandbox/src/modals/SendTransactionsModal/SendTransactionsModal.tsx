import { HStack, Icon, Separator, Spinner, Table, VStack } from '@chakra-ui/react';
import { type AVMNode, Chain } from '@kibisis/chains';
import { base58 } from '@kibisis/encoding';
import { type Account } from '@kibisis/katavault-core';
import { useChains, useHoldingAccounts, useSignAndSendRawTransactions } from '@kibisis/katavault-react';
import { Button, DEFAULT_GAP, Heading, Modal, Text, useColorMode } from '@kibisis/react';
import { upsertItemsByKey } from '@kibisis/utilities';
import { randomBytes } from '@stablelib/random';
import { makePaymentTxnWithSuggestedParamsFromObject, type Transaction, encodeAddress, Algodv2 } from 'algosdk';
import { type FC, useCallback, useState } from 'react';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';

// hooks
import useLogger from '@/hooks/useLogger';

// types
import type { ModalProps, SendTransactionModalTransactionItem } from '@/types';

const SendTransactionsModal: FC<ModalProps> = ({ onClose, open }) => {
  const accounts = useHoldingAccounts();
  const chains = useChains();
  const colorMode = useColorMode();
  const logger = useLogger();
  const signAndSendRawTransactions = useSignAndSendRawTransactions();
  // states
  const [transactions, setTransactions] = useState<SendTransactionModalTransactionItem[]>([]);
  // callbacks
  const handleOnClose = useCallback(() => onClose(), []);
  const handleOnSendDummyTransactionClick = useCallback(async () => {
    const __logPrefix = `${SendTransactionsModal.displayName}#handleOnSendDummyTransactionClick`;
    const account: Account | null = accounts[0] ?? null;
    const chain: Chain | null = chains[0] ?? null;
    let algod: Algodv2;
    let node: AVMNode;
    let transaction: Transaction;
    let transactionID: string;

    // TODO: display error toast
    if (!account || !chain) {
      logger?.error(`${__logPrefix} - unable to get default account or chain`);

      return;
    }

    try {
      node = chain.networkConfiguration().algods.nodes[chain.networkConfiguration().algods.default];
      algod = new Algodv2(node.token ?? '', node.origin, node.port);
      transaction = makePaymentTxnWithSuggestedParamsFromObject({
        amount: BigInt(1),
        lease: randomBytes(32), // use a random lease to ensure the transaction hash does not clash with another transaction in the block
        receiver: encodeAddress(base58.decode(account.key)),
        sender: encodeAddress(base58.decode(account.key)),
        suggestedParams: await algod.getTransactionParams().do(),
      });
    } catch (error) {
      logger?.error(`${__logPrefix} -`, error);

      return;
    }

    transactionID = transaction.txID();

    logger?.debug(`${__logPrefix} - created transaction "${transactionID}":`, transaction.toEncodingData());

    setTransactions((prevState) =>
      upsertItemsByKey(
        prevState,
        [
          {
            loading: true,
            result: null,
            transactionID,
          },
        ],
        'transactionID'
      )
    );

    signAndSendRawTransactions(
      [
        {
          accountKey: account.key,
          chainID: chain.chainID(),
          transaction: transaction.toByte(),
        },
      ],
      {
        onError: (error) =>
          setTransactions((prevState) =>
            upsertItemsByKey(
              prevState,
              [
                {
                  loading: false,
                  result: {
                    error: error,
                    success: false,
                  },
                  transactionID,
                },
              ],
              'transactionID'
            )
          ),
        onSuccess: ([result]) =>
          setTransactions((prevState) =>
            upsertItemsByKey(
              prevState,
              [
                {
                  loading: false,
                  result: {
                    error: result.error,
                    success: result.success,
                  },
                  transactionID,
                },
              ],
              'transactionID'
            )
          ),
      }
    );
  }, [accounts, chains, setTransactions, signAndSendRawTransactions]);

  return (
    <Modal
      body={
        <VStack align="center" w="full">
          <VStack align="center" gap={DEFAULT_GAP} maxW="768px" w="full">
            <Text colorMode={colorMode}>{`Send transactions to be signed effortlessly by the holding account.`}</Text>

            <Button onClick={handleOnSendDummyTransactionClick}>Send Payment Transaction</Button>

            <Separator />

            <Table.ScrollArea borderWidth="1px" height="500px" rounded="md" w="full">
              <Table.Root size="sm" stickyHeader={true}>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Transaction ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Comment</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {transactions.map(({ result, transactionID }, index) => (
                    <Table.Row key={`send-transaction-modal-transaction-item-${index}`}>
                      <Table.Cell>
                        <Text fontSize="sm">{transactionID}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        {(() => {
                          if (result) {
                            if (result.error || !result.success) {
                              return (
                                <Icon color="red.500" size="sm">
                                  <LuCircleX />
                                </Icon>
                              );
                            }

                            if (result.success) {
                              return (
                                <Icon color="green.500" size="sm">
                                  <LuCircleCheck />
                                </Icon>
                              );
                            }
                          }

                          return <Spinner size="sm" />;
                        })()}
                      </Table.Cell>

                      <Table.Cell>
                        {(() => {
                          if (result) {
                            if (result.error || !result.success) {
                              return (
                                <Text color="red.500" fontSize="sm">
                                  {result.error?.message || 'Transaction unsuccessful!'}
                                </Text>
                              );
                            }

                            if (result.success) {
                              return (
                                <Text color="green.500" fontSize="sm">
                                  Transaction successful!
                                </Text>
                              );
                            }
                          }

                          return <Text fontSize="sm">-</Text>;
                        })()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </VStack>
        </VStack>
      }
      closeButton={true}
      colorMode={colorMode}
      header={
        <HStack gap={1} w="full">
          <Heading colorMode={colorMode}>Send Transactions</Heading>
        </HStack>
      }
      onClose={handleOnClose}
      open={open}
    />
  );
};

SendTransactionsModal.displayName = 'SendTransactionsModal';

export default SendTransactionsModal;
