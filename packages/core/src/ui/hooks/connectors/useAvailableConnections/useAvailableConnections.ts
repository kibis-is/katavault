import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { ConnectorsContext } from '@/ui/contexts';

// types
import type { WalletConnection, WithConnectorID } from '@/types';

export default function useAvailableConnections(): WithConnectorID<WalletConnection>[] {
  const connectors = useContext(ConnectorsContext);
  // states
  const [connections, setConnections] = useState<WithConnectorID<WalletConnection>[]>([]);

  useEffect(() => {
    (async () => {
      let _connections: WithConnectorID<WalletConnection>[] = [];
      let availableConnections: WalletConnection[];

      for (const connector of connectors) {
        availableConnections = await connector.availableConnections();
        _connections = [
          ..._connections,
          ...availableConnections.map((value) => ({
            ...value,
            connectorID: connector.id(),
          })),
        ];
      }

      setConnections(_connections);
    })();
  }, [connectors.length]);

  return connections;
}
