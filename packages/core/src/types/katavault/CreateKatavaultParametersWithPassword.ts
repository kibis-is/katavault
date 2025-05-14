// types
import type { CreateKatavaultParameters } from '@/types';

/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {Omit<ClientInformation, 'host'>} client - [optional] The client's name and icon URL.
 * @property {string} password - A password to use for password authentication.
 */
interface CreateKatavaultParametersWithPassword extends CreateKatavaultParameters {
  password: string;
}

export default CreateKatavaultParametersWithPassword;
