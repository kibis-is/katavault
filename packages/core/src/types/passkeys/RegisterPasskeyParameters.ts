// types
import type { ClientInformation, CommonParameters, UserInformation } from '@/types';

interface RegisterPasskeyParameters extends CommonParameters {
  client: ClientInformation;
  user: UserInformation;
}

export default RegisterPasskeyParameters;
