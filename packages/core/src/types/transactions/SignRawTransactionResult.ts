// types
import type { WithCommonResult } from '@/types';

/**
 * @property {BaseError | null} error - If the transaction signing was unsuccessful, the exact error will be available.
 * @property {Uint8Array | null} signature - The signature of the signed transaction data or null if the signing was
 * unsuccessful.
 * @property {boolean} success - Whether the transaction signing was successful.
 */
type SignRawTransactionResult = WithCommonResult<Record<'signature', Uint8Array | null>>;

export default SignRawTransactionResult;
