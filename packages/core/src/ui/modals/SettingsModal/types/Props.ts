// types
import type { ModalProps } from '@/ui/types';

interface ComponentProps {
  onLogout: () => void;
}

type Props = ModalProps & ComponentProps;

export default Props;
