import type { Chain } from '@kibisis/chains';

// types
import type { ClientInformation } from '@/types';

/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {[Chain, ...Chain[]]} chains - A collection of chains.
 * @property {Omit<ClientInformation, 'host'>} client - [optional] The client's name and the icon URL.
 */
interface CreateKatavaultParameters {
  debug?: boolean;
  chains: [Chain, ...Chain[]];
  client?: Omit<ClientInformation, 'hostname'>;
}

export default CreateKatavaultParameters;
