// types
import type { CreateProviderUserParameters } from '@/types';

/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {CreateProviderUserParameters} user - Details about the user.
 */
interface CreateProviderParameters {
  debug?: boolean;
  user: CreateProviderUserParameters;
}

export default CreateProviderParameters;
