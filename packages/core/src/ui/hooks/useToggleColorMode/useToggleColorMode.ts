import { useContext } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// decorators
import { ConfigStore } from '@/decorators';

// types
import type { ConfigStoreSchema } from '@/types';

export default function useToggleColorMode(): () => void {
  // contexts
  const { onUpdate, state } = useContext(AppContext);

  return () => {
    (async () => {
      let store: ConfigStore;
      let config: ConfigStoreSchema | null;

      if (!state) {
        return;
      }

      store = new ConfigStore({
        logger: state.logger,
        vault: state.vault,
      });
      config = await store.config();

      await store.setConfig({
        ...config,
        colorMode: config?.colorMode === 'dark' ? 'light' : 'dark',
      });

      if (onUpdate) {
        onUpdate();
      }
    })();
  };
}
