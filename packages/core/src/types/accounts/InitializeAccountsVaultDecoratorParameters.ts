// types
import type { CommonParameters, UserInformation } from '@/types';

interface InitializeAccountsVaultDecoratorParameters extends CommonParameters {
  user: UserInformation;
}

export default InitializeAccountsVaultDecoratorParameters;
