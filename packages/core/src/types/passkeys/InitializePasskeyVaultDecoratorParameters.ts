// types
import { ClientInformation, CommonParameters, UserInformation } from '@/types';

interface InitializePasskeyVaultDecoratorParameters extends CommonParameters {
  client: ClientInformation;
  user: UserInformation;
}

export default InitializePasskeyVaultDecoratorParameters;
