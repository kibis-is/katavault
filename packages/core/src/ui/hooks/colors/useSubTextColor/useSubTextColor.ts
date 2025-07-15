// types
import type { ColorMode } from '@/types';

export default function useSubTextColor(colorMode: ColorMode): string {
  return colorMode === 'dark' ? 'rgba(255, 255, 255, 0.64)' : '#718096';
}
