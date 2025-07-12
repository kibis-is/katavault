// types
import type Account from './Account';

type WithKeyData<Value = Account> = Value & Readonly<Record<'keyData', Uint8Array>>;

export default WithKeyData;
