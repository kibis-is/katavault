// types
import type { ColorMode } from '@/types';

export default function usePrimaryColor(colorMode: ColorMode): string {
  return colorMode === 'dark' ? '#E0B0FF' : '#8D029B';
}
