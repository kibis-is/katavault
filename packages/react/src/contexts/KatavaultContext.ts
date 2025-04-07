import { Wallet } from '@kibisis/katavault-core';
import { createContext } from 'react';

const KatavaultContext = createContext<Wallet | null>(null);

export default KatavaultContext;
