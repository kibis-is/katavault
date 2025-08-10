// errors
import { BaseError } from '@/errors';

// types
import type { AuthenticateAppResult } from '@/types';

interface AppProps {
  onError: (error: BaseError) => void;
  onSuccess: (result: AuthenticateAppResult) => void;
}

export default AppProps;
