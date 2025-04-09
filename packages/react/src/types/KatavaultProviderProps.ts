import type { CreateKatavaultParameters } from '@kibisis/katavault-core';
import type { PropsWithChildren } from 'react';

interface Props {
  config: CreateKatavaultParameters;
}

type KatavaultProviderProps = PropsWithChildren<Props>;

export default KatavaultProviderProps;
