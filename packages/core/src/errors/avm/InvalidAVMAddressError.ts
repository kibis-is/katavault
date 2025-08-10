// constants
import { INVALID_AVM_ADDRESS_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class InvalidAVMAddressError extends BaseError {
  public readonly type = INVALID_AVM_ADDRESS_ERROR;
}
