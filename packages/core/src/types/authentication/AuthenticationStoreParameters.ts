// types
import type { StoreParameters } from '@/types';

interface AuthenticationStoreParameters extends StoreParameters {
  hostname: string;
  username: string;
}

export default AuthenticationStoreParameters;
