// types
import type { WithCommonResult } from '@/types';

type SignRawTransactionResult = WithCommonResult<Record<'signature', Uint8Array | null>>;

export default SignRawTransactionResult;
