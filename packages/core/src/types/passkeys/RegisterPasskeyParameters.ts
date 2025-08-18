// types
import type { ClientInformation, CommonParameters } from '@/types';

interface RegisterPasskeyParameters extends CommonParameters {
  clientInformation: ClientInformation;
  username: string;
}

export default RegisterPasskeyParameters;
