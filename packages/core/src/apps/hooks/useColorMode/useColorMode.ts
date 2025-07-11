import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/apps/contexts';

// types
import { ColorMode, ConfigStoreSchema } from '@/types';

export default function useColorMode(): ColorMode {
  const { state, timestamp } = useContext(AppContext);
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  useEffect(() => {
    (async () => {
      let config: ConfigStoreSchema | null;

      if (!state) {
        return;
      }

      config = await state.configStore.config();

      if (!config) {
        return;
      }

      setColorMode(config.colorMode);
    })();
  }, [timestamp]);

  return colorMode;
}
