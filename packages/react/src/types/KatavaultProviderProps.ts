import type { WalletParameters } from '@kibisis/katavault-core';
import type { PropsWithChildren } from 'react';

interface Props {
  config: WalletParameters;
}

type KatavaultProviderProps = PropsWithChildren<Props>;

export default KatavaultProviderProps;
