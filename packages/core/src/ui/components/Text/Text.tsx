import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps, TypographyProps } from '@/ui/types';

const Text: FunctionComponent<BaseComponentProps & TypographyProps> = ({
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
        return styles.textXs;
      case 'sm':
        return styles.textSm;
      case 'lg':
        return styles.textLg;
      case 'xl':
        return styles.textXl;
      case 'md':
      default:
        return styles.textMd;
    }
  }, [size]);
  const textAlignStyle = useMemo(() => {
    switch (textAlign) {
      case 'left':
        return styles.textLeft;
      case 'right':
        return styles.textRight;
      case 'center':
      default:
        return styles.textCenter;
    }
  }, [textAlign]);

  return (
    <p
      className={clsx(
        styles.text,
        sizeStyle,
        textAlignStyle,
        bold && styles.textBold,
        fullWidth && styles.textFullWidth
      )}
      data-color-mode={colorMode}
      style={{
        ...(color && {
          color,
        }),
      }}
    >
      {children}
    </p>
  );
};

export default Text;
