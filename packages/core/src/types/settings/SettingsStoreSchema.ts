// types
import type { ColorMode } from '@/types';

/**
 * @property {ColorMode} colorMode - The color mode of the apps.
 */
interface SettingsStoreSchema {
  colorMode: ColorMode;
}

export default SettingsStoreSchema;
