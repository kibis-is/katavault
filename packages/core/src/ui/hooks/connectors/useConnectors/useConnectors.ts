import { useContext } from 'preact/hooks';

// contexts
import { ConnectorsContext } from '@/ui/contexts';

// decorators
import { AbstractConnector } from '@/decorators/connectors';

export default function useConnectors(): AbstractConnector[] {
  return useContext(ConnectorsContext);
}
