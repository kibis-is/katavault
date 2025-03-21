// types
import type { Passkey } from '@/types';
import type SerializedPrivateKey from './SerializedPrivateKey';

type VaultSchemas = Passkey | Record<string, SerializedPrivateKey>;

export default VaultSchemas;
