// decorators
import { VaultDecorator } from '@/decorators';

// types
import type { ClientInformation, CommonParameters } from '@/types';

interface KatavaultParameters extends CommonParameters {
  client: ClientInformation;
  vault: VaultDecorator;
}

export default KatavaultParameters;
