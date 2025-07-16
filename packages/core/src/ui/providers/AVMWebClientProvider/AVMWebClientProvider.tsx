import { AVMWebClient } from '@agoralabs-sh/avm-web-provider';
import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { AVMWebClientContext } from '@/ui/contexts';

// types
import type { Props } from './types';

const AVMWebClientProvider: FunctionComponent<PropsWithChildren<Props>> = ({ avmWebClient, children }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<AVMWebClient>(avmWebClient);
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    setState(avmWebClient);
    onUpdate();
  }, [avmWebClient]);

  return (
    <AVMWebClientContext.Provider
      value={{
        onUpdate,
        state,
        timestamp,
      }}
    >
      {children}
    </AVMWebClientContext.Provider>
  );
};

export default AVMWebClientProvider;
