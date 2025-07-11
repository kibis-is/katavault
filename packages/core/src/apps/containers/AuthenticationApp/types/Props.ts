// errors
import { BaseError } from '@/errors';

// types
import type { AuthenticateWithPasskeyResult, AuthenticateWithPasswordResult } from '@/types';

interface Props {
  onError: (error: BaseError) => void;
  onSuccess: (result: AuthenticateWithPasskeyResult | AuthenticateWithPasswordResult) => void;
}

export default Props;
