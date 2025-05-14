// types
import type { AuthenticationClient, CommonParameters, UserInformation } from '@/types';

interface InitializeKatavaultParameters extends CommonParameters {
  authenticationClient: AuthenticationClient;
  user: UserInformation;
}

export default InitializeKatavaultParameters;
