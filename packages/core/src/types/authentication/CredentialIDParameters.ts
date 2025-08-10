// enums
import { AuthenticationMethodEnum } from '@/enums';

interface CredentialIDParameters {
  method: AuthenticationMethodEnum;
  payload: string;
}

export default CredentialIDParameters;
