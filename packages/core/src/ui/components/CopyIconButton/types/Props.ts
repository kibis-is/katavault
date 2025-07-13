// types
import type { Props as IconButtonProps } from '@/ui/components/IconButton';

interface ComponentProps {
  text: string;
}

type Props = Omit<IconButtonProps, 'icon' | 'onClick'> & ComponentProps;

export default Props;
