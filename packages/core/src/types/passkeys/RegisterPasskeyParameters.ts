// types
import type { CommonParameters } from '@/types';
import type RegisterPasskeyClientParameters from './RegisterPasskeyClientParameters';
import type RegisterPasskeyUserParameters from './RegisterPasskeyUserParameters';

interface RegisterPasskeyParameters extends CommonParameters {
  client: RegisterPasskeyClientParameters;
  user: RegisterPasskeyUserParameters;
}

export default RegisterPasskeyParameters;
