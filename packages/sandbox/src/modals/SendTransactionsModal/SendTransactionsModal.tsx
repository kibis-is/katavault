import { HStack, Icon, Separator, Spinner, Table, VStack } from '@chakra-ui/react';
import { type AVMNode, Chain } from '@kibisis/chains';
import { base58, utf8 } from '@kibisis/encoding';
import { type Account, FailedToSignError } from '@kibisis/katavault-core';
import { useChains, useHoldingAccounts, useKatavault } from '@kibisis/katavault-react';
import { Button, DEFAULT_GAP, Heading, Modal, Text, useColorMode } from '@kibisis/react';
import { upsertItemsByKey } from '@kibisis/utilities';
import { uuid } from '@stablelib/uuid';
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
  const katavault = useKatavault();
  const logger = useLogger();
  // states
  const [transactions, setTransactions] = useState<SendTransactionModalTransactionItem[]>([]);
  // callbacks
  const handleOnClose = useCallback(() => onClose(), []);
  const handleOnSendDummyTransactionClick = useCallback(async () => {
    const __logPrefix = `${SendTransactionsModal.displayName}#handleOnSendDummyTransactionClick`;
    let chain: Chain | null;
    let account: Account | null;
    let algod: Algodv2;
    let node: AVMNode;
    let transaction: Transaction;

    if (!katavault) {
      logger?.error(`${__logPrefix} - katavault has not been initialized`);

      return;
    }

    chain = chains[0] ?? null;
    account = accounts[0] ?? null;

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
        receiver: encodeAddress(base58.decode(account.key)),
        sender: encodeAddress(base58.decode(account.key)),
        note: utf8.decode(uuid()),
        suggestedParams: await algod.getTransactionParams().do(),
      });
    } catch (error) {
      logger?.error(`${__logPrefix} -`, error);

      return;
    }

    setTransactions((prevState) =>
      upsertItemsByKey(
        prevState,
        [
          {
            loading: true,
            result: null,
            transactionID: transaction.txID(),
          },
        ],
        'transactionID'
      )
    );

    try {
      const [signature] = await katavault.signRawTransactions([
        {
          accountKey: account.key,
          chainID: chain.chainID(),
          transaction: transaction.toByte(),
        },
      ]);

      if (!signature) {
        return setTransactions((prevState) =>
          upsertItemsByKey(
            prevState,
            [
              {
                loading: false,
                result: {
                  error: new FailedToSignError('failed to sign transaction'),
                  success: false,
                },
                transactionID: transaction.txID(),
              },
            ],
            'transactionID'
          )
        );
      }

      logger?.debug(`${__logPrefix} - signed transaction "${transaction.txID()}"`);

      const [result] = await katavault.sendRawTransactions([
        {
          chainID: chain.chainID(),
          signature,
          transaction: transaction.toByte(),
        },
      ]);

      return setTransactions((prevState) =>
        upsertItemsByKey(
          prevState,
          [
            {
              loading: false,
              result: {
                error: result.error,
                success: result.success,
              },
              transactionID: transaction.txID(),
            },
          ],
          'transactionID'
        )
      );
    } catch (error) {
      return setTransactions((prevState) =>
        upsertItemsByKey(
          prevState,
          [
            {
              loading: false,
              result: {
                error: error,
                success: false,
              },
              transactionID: transaction.txID(),
            },
          ],
          'transactionID'
        )
      );
    }
  }, [accounts, chains, katavault, setTransactions]);

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
