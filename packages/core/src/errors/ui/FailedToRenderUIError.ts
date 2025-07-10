// constants
import { FAILED_TO_RENDER_UI_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToRenderUIError extends BaseError {
  public readonly type = FAILED_TO_RENDER_UI_ERROR;
}
