import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';
import { useCallback, useState } from 'preact/hooks';

// hooks
import useAVMWebClient from '@/ui/hooks/connections/useAVMWebClient';
import useLogger from '@/ui/hooks/logging/useLogger';

// types
import type { ConnectParameters, State } from './types';

export default function useAVMProviderConnect(): State {
  // hooks
  const avmWebClient = useAVMWebClient();
  const logger = useLogger();
  // states
  const [connection, setConnection] = useState<IDiscoverResult | null>(null);
  // callbacks
  const connect = useCallback(
    ({ connection: _connection, onError, onSuccess }: ConnectParameters) => {
      const __logPrefix = 'useAVMProviderConnect#connect';
      let listenerID: string;

      if (!avmWebClient) {
        logger?.error(`${__logPrefix}: avm web provider no initialized found.`);

        return;
      }

      setConnection(_connection);

      listenerID = avmWebClient.onEnable(({ error, result }) => {
        if (error) {
          onError(error);
        }

        if (result) {
          onSuccess(result);
        }

        setConnection(null);
        avmWebClient.removeListener(listenerID);
      });

      avmWebClient.enable({
        providerId: _connection.providerId,
      });
    },
    [avmWebClient, setConnection]
  );

  return {
    connect,
    connection,
  };
}
