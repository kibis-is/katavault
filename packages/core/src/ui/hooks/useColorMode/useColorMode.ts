import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// decorators
import { ConfigStore } from '@/decorators';

// types
import { ColorMode, ConfigStoreSchema } from '@/types';

export default function useColorMode(): ColorMode {
  const { state, timestamp } = useContext(AppContext);
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  useEffect(() => {
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

      if (!config) {
        return;
      }

      setColorMode(config.colorMode);
    })();
  }, [timestamp]);

  return colorMode;
}
