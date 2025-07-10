import { ILogger } from '@kibisis/utilities';

// types
import type { ColorMode } from '@/types';

interface BaseAppProps {
  colorMode: ColorMode;
  onClose: () => void;
  logger: ILogger;
}

export default BaseAppProps;
