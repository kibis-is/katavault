// types
import type CommonParameters from './CommonParameters';

type WithCommonParameters<Type> = Type & CommonParameters;

export default WithCommonParameters;
