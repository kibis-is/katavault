// decorators
import { VaultDecorator } from '@/decorators';

// types
import type { ClientInformation, CommonParameters, UserInformation } from '@/types';

interface EmbeddedWalletParameters extends CommonParameters {
  client: ClientInformation;
  vault: VaultDecorator;
  user: UserInformation;
}

export default EmbeddedWalletParameters;
