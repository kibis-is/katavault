// types
import type Encoding from './Encoding';

type WithEncoding<Type> = Type & Record<'encoding', Encoding>;

export default WithEncoding;
