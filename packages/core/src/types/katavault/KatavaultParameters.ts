import type { ChainWithNetworkParameters } from '@kibisis/chains';

// types
import type { ClientInformation, CommonParameters } from '@/types';

interface KatavaultParameters extends CommonParameters {
  chains: ChainWithNetworkParameters[];
  clientInformation: ClientInformation;
}

export default KatavaultParameters;
