// types
import type CreateProviderAccountSeedParameters from './CreateProviderAccountSeedParameters';

/**
 * @property {string[]} seeds - [optional] A set of accounts to initialize the wallet with. If any of the seeds are
 * invalid, they are omitted. If this parameter is omitted, the wallet is initialized with a randomly generated account.
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 */
interface CreateProviderParameters {
  accounts?: CreateProviderAccountSeedParameters[];
  debug?: boolean;
}

export default CreateProviderParameters;
