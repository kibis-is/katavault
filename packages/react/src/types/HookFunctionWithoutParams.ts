// types
import type HookFunctionOptions from './HookFunctionOptions';

type HookFunctionWithoutParams<Result, Error> = (options?: HookFunctionOptions<undefined, Result, Error>) => void;

export default HookFunctionWithoutParams;
