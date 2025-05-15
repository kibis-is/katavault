// constants
import { DECRYPTION_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class DecryptionError extends BaseError {
  public readonly type = DECRYPTION_ERROR;
}
