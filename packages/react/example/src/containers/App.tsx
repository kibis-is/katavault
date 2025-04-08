import { KatavaultProvider } from '@kibisis/katavault-react';
import { type FC } from 'react';

// configs
import config from '../config';

// containers
import Root from './Root';

const App: FC = () => {
  return (
    <KatavaultProvider config={config}>
      <Root />
    </KatavaultProvider>
  );
};

export default App;
