// enums
import { AuthenticationMethod } from '@/enums';

interface PasswordAuthenticationParameters {
  __type: AuthenticationMethod.Password;
  password: string;
}

export default PasswordAuthenticationParameters;
