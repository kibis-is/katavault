// decorators
import { AccountsVaultDecorator } from '@/decorators';

// types
import type { AuthenticationClient, CommonParameters, UserInformation } from '@/types';

interface KatavaultParameters extends CommonParameters {
  accountsVaultClient: AccountsVaultDecorator;
  authenticationClient: AuthenticationClient;
  user: UserInformation;
}

export default KatavaultParameters;
