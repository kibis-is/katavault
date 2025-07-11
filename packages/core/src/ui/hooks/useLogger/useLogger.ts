import { ILogger } from '@kibisis/utilities';
import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

export default function useLogger(): ILogger | null {
  const { state, timestamp } = useContext(AppContext);
  const [logger, setLogger] = useState<ILogger | null>(null);

  useEffect(() => {
    if (!state) {
      return;
    }

    setLogger(state.logger);
  }, [timestamp]);

  return logger;
}
