import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';
import { useCallback, useEffect, useState } from 'preact/hooks';

// hooks
import useAVMWebClient from '@/ui/hooks/connections/useAVMWebClient';
import useLogger from '@/ui/hooks/logging/useLogger';

// types
import type { State } from './types';

export default function useAVMProviderDiscovery(): State {
  // hooks
  const avmWebClient = useAVMWebClient();
  const logger = useLogger();
  // states
  const [connectors, setConnectors] = useState<IDiscoverResult[]>([]);
  // callbacks
  const discover = useCallback(() => {
    const __logPrefix = 'useAVMProviderDiscovery#discover';

    if (!avmWebClient) {
      logger?.error(`${__logPrefix}: avm web provider no initialized found.`);

      return;
    }

    avmWebClient.discover();
  }, [avmWebClient]);

  useEffect(() => {
    const __logPrefix = 'useAVMProviderDiscovery#useEffect[avmWebClient, connectors, setConnectors]';
    let listenerID: string;

    if (avmWebClient) {
      listenerID = avmWebClient.onDiscover(({ error, result }) => {
        let connectorIndex: number;

        if (error) {
          logger?.error(`${__logPrefix}:`, error);

          return;
        }

        if (result) {
          connectorIndex = connectors.findIndex(({ providerId }) => providerId === result.providerId);

          // connector doesn't exist
          if (connectorIndex < 0) {
            setConnectors([...connectors, result]);

            return;
          }

          setConnectors(connectors.map((connector, index) => (connectorIndex === index ? result : connector)));

          return;
        }
      });

      avmWebClient.discover();
    }

    return () => {
      if (avmWebClient && listenerID) {
        avmWebClient.removeListener(listenerID);
      }
    };
  }, [avmWebClient]);

  return {
    connectors,
    discover,
  };
}
