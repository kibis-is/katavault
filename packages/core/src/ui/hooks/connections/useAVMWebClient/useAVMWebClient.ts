import { AVMWebClient } from '@agoralabs-sh/avm-web-provider';
import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AVMWebClientContext } from '@/ui/contexts';

export default function useAVMWebClient(): AVMWebClient | null {
  const { state, timestamp } = useContext(AVMWebClientContext);
  const [value, setValue] = useState<AVMWebClient | null>(state);

  useEffect(() => {
    if (!state) {
      return;
    }

    setValue(state);
  }, [timestamp]);

  return value;
}
