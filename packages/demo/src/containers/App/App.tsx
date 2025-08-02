import type { ColorMode } from '@chakra-ui/color-mode';
import { VoiTestnet } from '@kibisis/chains';
import { CreateKatavaultParameters } from '@kibisis/katavault-core';
import { KibisisAppProvider } from '@kibisis/react';
import { type FC, useCallback, useMemo, useState } from 'react';

// containers
import Root from '@/containers/Root';

// types
import type { Props } from './types';

const App: FC<Props> = ({ logger }) => {
  // states
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  // memos
  const config = useMemo<CreateKatavaultParameters>(
    () => ({
      chains: [VoiTestnet],
      debug: true,
    }),
    []
  );
  // callbacks
  const handleOnToggleColorMode = useCallback(
    () => setColorMode(colorMode === 'light' ? 'dark' : 'light'),
    [colorMode, setColorMode]
  );

  return (
    <KibisisAppProvider colorMode={colorMode} debug={true} logger={logger}>
      <Root onToggleColorMode={handleOnToggleColorMode} />
    </KibisisAppProvider>
  );
};

export default App;
