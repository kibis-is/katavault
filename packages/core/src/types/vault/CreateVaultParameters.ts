// types
import type { CommonParameters, UserInformation } from '@/types';

interface CreateVaultParameters extends CommonParameters {
  user: UserInformation;
}

export default CreateVaultParameters;
