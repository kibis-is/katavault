// types
import type { ClientInformation, UserInformation } from '@/types';

/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {Omit<ClientInformation, 'host'>} client - [optional] The client's name and icon URL.
 * @property {UserInformation} user - The user information.
 */
interface CreateKatavaultParameters {
  debug?: boolean;
  client?: Omit<ClientInformation, 'host'>;
  user: UserInformation;
}

export default CreateKatavaultParameters;
