// types
import type { PrivateKey } from '@/types';

/**
 * @property {string} keyData - The hexadecimal encoded encrypted private key that can be safely serialized.
 */
interface SerializedPrivateKey extends Omit<PrivateKey, 'keyData'> {
  keyData: string;
}

export default SerializedPrivateKey;
