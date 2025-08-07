// types
import type { WithCommonResult } from '@/types';

type SendRawTransactionResult = WithCommonResult<Record<'transactionID', string | null>>;

export default SendRawTransactionResult;
