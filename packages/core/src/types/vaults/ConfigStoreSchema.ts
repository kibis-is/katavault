// types
import type { ColorMode } from '@/types';

/**
 * @property {ColorMode} colorMode - The color mode of the apps.
 */
interface ConfigStoreSchema {
  colorMode: ColorMode;
}

export default ConfigStoreSchema;
