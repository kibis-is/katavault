import clsx from 'clsx';
import { cloneElement, type FunctionComponent } from 'preact';

// components
import Heading from '@/ui/components/typography/Heading';
import HStack from '@/ui/components/layouts/HStack';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const SettingsSubHeading: FunctionComponent<Props> = ({
  children,
  color,
  colorMode,
  icon,
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);

  return (
    <HStack align="center" fullWidth={true} spacing="xs">
      {icon && cloneElement(icon, {
        ...icon.props,
        className: clsx(styles.icon),
        color: color ?? defaultTextColor,
      })}

      <Heading color={color ?? defaultTextColor} colorMode={colorMode} fullWidth={true} size="sm" textAlign="left">
        {children}
      </Heading>
    </HStack>
  );
};

export default SettingsSubHeading;
