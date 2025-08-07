// errors
import { BaseError } from '@/errors';

interface CommonResult {
  error: BaseError | null;
  success: boolean;
}

export default CommonResult;
