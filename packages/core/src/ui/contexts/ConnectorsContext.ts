import { createContext } from 'preact';

// decorators
import { AbstractConnector } from '@/decorators/connectors';

const ConnectorsContext = createContext<AbstractConnector[]>([]);

export default ConnectorsContext;
