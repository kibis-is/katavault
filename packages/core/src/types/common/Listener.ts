// types
import type ListenerTypes from './ListenerTypes';

interface Listener<Type extends ListenerTypes> {
  callback: Type extends 'logout'
    ? () => Promise<void> | void
    : Type extends 'vault_cleared'
      ? () => Promise<void> | void
      : never;
  type: Type;
}

export default Listener;
