import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps, TypographyProps } from '@/ui/types';

const Heading: FunctionComponent<BaseComponentProps & TypographyProps> = ({
  bold = false,
  children,
  color,
  colorMode,
  fullWidth = false,
  size = 'md',
  textAlign = 'center',
}) => {
  // memos
  const sizeStyle = useMemo(() => {
    switch (size) {
      case 'xs':
        return styles.headingXs;
      case 'sm':
        return styles.headingSm;
      case 'lg':
        return styles.headingLg;
      case 'xl':
        return styles.headingXl;
      case 'md':
      default:
        return styles.headingMd;
    }
  }, [size]);
  const textAlignStyle = useMemo(() => {
    switch (textAlign) {
      case 'left':
        return styles.headingLeft;
      case 'right':
        return styles.headingRight;
      case 'center':
      default:
        return styles.headingCenter;
    }
  }, [textAlign]);

  return (
    <h1
      className={clsx(
        styles.heading,
        sizeStyle,
        textAlignStyle,
        bold && styles.headingBold,
        fullWidth && styles.headingFullWidth
      )}
      data-color-mode={colorMode}
      style={{
        ...(color && {
          color,
        }),
      }}
    >
      {children}
    </h1>
  );
};

export default Heading;
