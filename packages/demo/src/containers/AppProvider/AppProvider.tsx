import { type FC, type PropsWithChildren } from 'react';

// contexts
import { LoggerContext } from '@/contexts';

// types
import type { Props } from './types';

const AppProvider: FC<PropsWithChildren<Props>> = ({ children, logger }) => {
  return <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>;
};

export default AppProvider;
