// errors
import { BaseError } from '@/errors';

// types
import type { AuthenticationStore } from '@/types';

interface AppProps {
  onError: (error: BaseError) => void;
  onSuccess: (result: AuthenticationStore) => void;
}

export default AppProps;
