import type { CreateWalletParameters } from '@kibisis/katavault-core';
import type { PropsWithChildren } from 'react';

interface Props {
  config: CreateWalletParameters;
}

type KatavaultProviderProps = PropsWithChildren<Props>;

export default KatavaultProviderProps;
