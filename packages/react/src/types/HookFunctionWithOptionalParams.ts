// types
import type HookFunctionOptions from './HookFunctionOptions';

type HookFunctionWithOptionalParams<Params, Result, Error> = (
  params?: Params,
  options?: HookFunctionOptions<Params, Result, Error>
) => void;

export default HookFunctionWithOptionalParams;
