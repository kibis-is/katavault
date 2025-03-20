// constants
import { VAULT_NOT_INITIALIZED_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class VaultNotInitializedError extends BaseError {
  public readonly type = VAULT_NOT_INITIALIZED_ERROR;

  public constructor() {
    super('vault not initialized');
  }
}
