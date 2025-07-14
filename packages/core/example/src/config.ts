import { algorandTestnet, voiTestnet } from '@kibisis/chains';
import type { CreateKatavaultParameters } from '@kibisis/katavault-core';

const config: CreateKatavaultParameters = {
  chains: [voiTestnet, algorandTestnet],
  debug: true,
};

export default config;
