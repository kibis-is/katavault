// types
import type { CommonParameters, UserInformation } from '@/types';

interface InitializePasswordVaultDecoratorParameters extends CommonParameters {
  password: string;
  user: UserInformation;
}

export default InitializePasswordVaultDecoratorParameters;
