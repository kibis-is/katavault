// types
import type Vault from './Vault';

type WithVault<Type> = Type & Record<'vault', Vault>;

export default WithVault;
