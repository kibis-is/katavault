// errors
import { BaseError } from '@/errors';

// types
import type { AuthenticateResult } from '@/types';

interface AppProps {
  onError: (error: BaseError) => void;
  onSuccess: (result: AuthenticateResult) => void;
}

export default AppProps;
