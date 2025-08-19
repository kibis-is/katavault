import { type ChangeEventHandler } from 'preact/compat';

// types
import type { BaseComponentProps, Sizes } from '@/ui/types';

interface ComponentProps {
  checked: boolean;
  disabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  size?: Sizes;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
