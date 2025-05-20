import { voiTestnet } from '@kibisis/chains';
import type { CreateKatavaultParameters } from '@kibisis/katavault-core';

const config: CreateKatavaultParameters = {
  chains: [voiTestnet],
  debug: true,
};

export default config;
