import { VoiTestnet } from '@kibisis/chains';
import { CreateKatavaultParameters } from '@kibisis/katavault-core';
import { type FC, useMemo } from 'react';

// containers
import AppProvider from '@/containers/AppProvider';
import Root from '@/containers/Root';

// types
import type { Props } from './types';

const App: FC<Props> = ({ logger }) => {
  const config = useMemo<CreateKatavaultParameters>(
    () => ({
      chains: [VoiTestnet],
      debug: true,
    }),
    []
  );

  return (
    <AppProvider logger={logger}>
      <Root />
    </AppProvider>
  );
};

export default App;
