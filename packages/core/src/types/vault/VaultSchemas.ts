// types
import type { Passkey } from '@/types';
import type SerializedAccount from './SerializedAccount';

type VaultSchemas = Passkey | Record<string, SerializedAccount>;

export default VaultSchemas;
