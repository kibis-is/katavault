import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// types
import { ClientInformation } from '@/types';

export default function useClientInformation(): ClientInformation | null {
  const { state, timestamp } = useContext(AppContext);
  const [clientInformation, setClientInformation] = useState<ClientInformation | null>(
    state?.clientInformation ?? null
  );

  useEffect(() => {
    if (!state) {
      return;
    }

    setClientInformation(state.clientInformation);
  }, [timestamp]);

  return clientInformation;
}
