// types
import type { BaseCreateKatavaultParameters, CreateKatavaultPasskeyParameters } from '@/types';

/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {Omit<ClientInformation, 'host'>} client - [optional] The client's name and icon URL.
 * @property {CreateKatavaultPasskeyParameters} passkey - Information to enable passkey authentication.
 */
interface CreateKatavaultParametersWithPasskey extends BaseCreateKatavaultParameters {
  passkey: CreateKatavaultPasskeyParameters;
}

export default CreateKatavaultParametersWithPasskey;
