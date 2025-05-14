// types
import type { ClientInformation } from '@/types';

/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {Omit<ClientInformation, 'host'>} client - [optional] The client's name and icon URL.
 */
interface CreateKatavaultParameters {
  debug?: boolean;
  client?: Omit<ClientInformation, 'host'>;
}

export default CreateKatavaultParameters;
