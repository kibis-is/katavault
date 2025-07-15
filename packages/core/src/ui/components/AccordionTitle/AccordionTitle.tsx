import clsx from 'clsx';
import { cloneElement, type FunctionComponent } from 'preact';

// components
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const AccordionTitle: FunctionComponent<Props> = ({
  colorMode,
  icon,
  title,
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);

  return (
    <HStack fullWidth={true} spacing="sm">
      {icon &&
        cloneElement(icon, {
          className: clsx(styles.icon),
          color: defaultTextColor,
        })}

      <Heading colorMode={colorMode} size="sm" textAlign="left">
        {title}
      </Heading>
    </HStack>
  );
};

export default AccordionTitle;
