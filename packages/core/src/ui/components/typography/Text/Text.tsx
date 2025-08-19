import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Text: FunctionComponent<Props> = ({
  bold = false,
  children,
  color,
  colorMode,
  className,
  fullWidth = false,
  height,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  size = 'md',
  textAlign = 'inherit',
  title,
  truncate = false,
  width,
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
      case 'center':
        return styles.textAlignCenter;
      case 'initial':
        return styles.textAlignInitial;
      case 'justify':
        return styles.textAlignJustify;
      case 'justify-all':
        return styles.textAlignJustifyAll;
      case 'left':
        return styles.textAlignLeft;
      case 'right':
        return styles.textAlignRight;
      case 'inherit':
      default:
        return styles.textAlignInherit;
    }
  }, [textAlign]);

  return (
    <p
      className={clsx(
        styles.text,
        sizeStyle,
        textAlignStyle,
        bold && styles.textBold,
        fullWidth && styles.textFullWidth,
        truncate && styles.textTruncate,
        className,
      )}
      data-color-mode={colorMode}
      style={{
        ...(color && {
          color,
        }),
        ...(height && {
          height: typeof height === 'number' ? `${height}px` : height,
        }),
        ...(maxHeight && {
          maxHeight:
            typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }),
        ...(maxWidth && {
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        }),
        ...(minHeight && {
          minHeight:
            typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        }),
        ...(minWidth && {
          minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
        }),
        ...(width && {
          width: typeof height === 'number' ? `${width}px` : width,
        }),
      }}
      title={title ? title : typeof children === 'string' ? children : undefined}
    >
      {children}
    </p>
  );
};

export default Text;
