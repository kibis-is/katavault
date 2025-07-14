import clsx from 'clsx';
import { cloneElement, type FunctionComponent } from 'preact';

// components
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// hooks
import useSubTextColor from '@/ui/hooks/useSubTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const EmptyAccountCard: FunctionComponent<Props> = ({ colorMode, icon, onClick, text }) => {
  // hooks
  const subTextColor = useSubTextColor(colorMode);

  return (
    <div className={clsx(styles.container, onClick && styles.containerClickable)} data-color-mode={colorMode} onClick={onClick}>
      <VStack align="center" className={clsx(styles.content)} fullWidth={true} justify="center" spacing="sm">
        {icon && cloneElement(icon, {
          ...icon.props,
          className: clsx(styles.icon),
          color: subTextColor,
        })}

        <Text colorMode={colorMode} color={subTextColor} size={icon ? 'md' : 'lg'}>
          {text}
        </Text>
      </VStack>
    </div>
  );
};

export default EmptyAccountCard;
