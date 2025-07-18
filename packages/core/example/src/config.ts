import { AlgorandTestnet, VoiTestnet } from '@kibisis/chains';
import type { CreateKatavaultParameters } from '@kibisis/katavault-core';

const config: CreateKatavaultParameters = {
  chains: [VoiTestnet, AlgorandTestnet],
  debug: true,
};

export default config;
