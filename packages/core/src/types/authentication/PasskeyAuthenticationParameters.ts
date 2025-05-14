// enums
import { AuthenticationMethod } from '@/enums';

// types
import type { CreateKatavaultPasskeyParameters } from '@/types';

type PasskeyAuthenticationParameters = CreateKatavaultPasskeyParameters & {
  __type: AuthenticationMethod.Passkey;
};

export default PasskeyAuthenticationParameters;
