// types
import type CommonResult from './CommonResult';

type WithCommonResult<Type> = Type & CommonResult;

export default WithCommonResult;
