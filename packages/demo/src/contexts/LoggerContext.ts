import type { ILogger } from '@kibisis/utilities';
import { createContext } from 'react';

const LoggerContext = createContext<ILogger | null>(null);

export default LoggerContext;
