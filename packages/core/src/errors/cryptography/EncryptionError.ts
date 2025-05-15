// constants
import { ENCRYPTION_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class EncryptionError extends BaseError {
  public readonly type = ENCRYPTION_ERROR;
}
