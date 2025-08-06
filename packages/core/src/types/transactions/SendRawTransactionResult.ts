// errors
import { BaseError } from '@/errors';

interface SendRawTransactionResult {
  error: BaseError | null;
  success: boolean;
  transactionID: string | null;
}

export default SendRawTransactionResult;
