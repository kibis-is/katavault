import type { SendRawTransactionResult } from '@kibisis/katavault-core';

interface SendTransactionModalTransactionItem {
  loading: boolean;
  result: Omit<SendRawTransactionResult, 'transactionID'> | null;
  transactionID: string;
}

export default SendTransactionModalTransactionItem;
