import type { CommonResult } from '@kibisis/katavault-core';

interface SendTransactionModalTransactionItem {
  loading: boolean;
  result: CommonResult | null;
  transactionID: string;
}

export default SendTransactionModalTransactionItem;
