// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  onClose: () => void;
  open: boolean;
}

type ModalProps = BaseComponentProps & ComponentProps;

export default ModalProps;
