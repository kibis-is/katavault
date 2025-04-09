// types
import type HookFunctionOptions from './HookFunctionOptions';

type HookFunction<Params, Result, Error> = (
  params: Params,
  options?: HookFunctionOptions<Params, Result, Error>
) => void;

export default HookFunction;
