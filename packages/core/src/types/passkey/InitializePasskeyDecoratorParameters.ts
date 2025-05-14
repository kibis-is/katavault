// types
import { ClientInformation, CommonParameters, PasskeyUserInformation } from '@/types';

interface InitializePasskeyDecoratorParameters extends CommonParameters {
  client: ClientInformation;
  user: PasskeyUserInformation;
}

export default InitializePasskeyDecoratorParameters;
