import type { Chain } from '@kibisis/chains';

// types
import type { ClientInformation, CommonParameters } from '@/types';

interface KatavaultParameters extends CommonParameters {
  chains: Chain[];
  clientInformation: ClientInformation;
}

export default KatavaultParameters;
