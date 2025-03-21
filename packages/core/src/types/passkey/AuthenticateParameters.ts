// types
import type { CommonParameters, Passkey } from '@/types';

interface AuthenticateParameters extends CommonParameters {
  passkey: Passkey;
}

export default AuthenticateParameters;
