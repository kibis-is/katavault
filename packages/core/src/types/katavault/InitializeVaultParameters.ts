// types
import type { CommonParameters, UserInformation } from '@/types';

interface InitializeVaultParameters extends CommonParameters {
  user: UserInformation;
}

export default InitializeVaultParameters;
