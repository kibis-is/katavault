// types
import type { ModalProps } from '@/ui/types';

interface ComponentProps {
  message: string;
  onConfirm: () => void;
  title: string;
}

type Props = ModalProps & ComponentProps;

export default Props;
