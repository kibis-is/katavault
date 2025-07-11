import { useContext } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// types
import type { ConfigStoreSchema } from '@/types';

export default function useToggleColorMode(): () => void {
  // contexts
  const { onUpdate, state } = useContext(AppContext);

  return () => {
    (async () => {
      let config: ConfigStoreSchema | null;

      if (!state) {
        return;
      }

      config = await state.configStore.config();

      await state.configStore.setConfig({
        ...config,
        colorMode: config?.colorMode === 'dark' ? 'light' : 'dark',
      });

      if (onUpdate) {
        onUpdate();
      }
    })();
  };
}
