// types
import type OnErrorHandler from './OnErrorHandler';
import type OnSuccessHandler from './OnSuccessHandler';

interface HookFunctionOptions<Params, Result, Error> {
  onError?: OnErrorHandler<Error, Params>;
  onSuccess?: OnSuccessHandler<Result, Params>;
}

export default HookFunctionOptions;
