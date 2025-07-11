// types
import type { ColorMode } from '@/types';

export default function useDefaultTextColor(colorMode: ColorMode): string {
  return colorMode === 'dark' ? 'rgba(255, 255, 255, 0.80)' : '#4A5568';
}
