// types
import type { Props as InputProps } from '@/ui/components/inputs/Input';

type Props = Omit<InputProps, 'autocomplete' | 'rightButton' | 'type'>;

export default Props;
