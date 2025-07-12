// types
import type { ColorMode } from '@/types';

interface RootProps {
  colorMode: ColorMode;
  onSetColorMode: (value: ColorMode) => void;
}

export default RootProps;
