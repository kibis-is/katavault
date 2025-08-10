// errors
import { BaseError } from '@/errors';

/**
 * @property {BaseError | null} error - If action was unsuccessful, an error will be available.
 * @property {boolean} success - Tru if successful, false otherwise.
 */
interface CommonResult {
  error: BaseError | null;
  success: boolean;
}

export default CommonResult;
