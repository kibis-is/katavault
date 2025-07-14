import type { JSX } from 'preact';

// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  buttonClassName?: string;
  containerClassName?: string;
  content: JSX.Element;
  onClick: () => void;
  open: boolean;
  title: JSX.Element;
}

type Props = ComponentProps & BaseComponentProps;

export default Props;
