// errors
import { BaseError } from '@/errors';

interface OnAppCallbackParameters<Result> {
  onError: (error: BaseError) => void;
  onSuccess: (result: Result) => void;
}

export default OnAppCallbackParameters;
