// types
import type { ColorMode } from '@/types';

export default function useBackgroundColor(colorMode: ColorMode): string {
  return colorMode === 'dark' ? '#1A202C' : '#FFFFFF';
}
