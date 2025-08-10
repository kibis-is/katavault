import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Heading: FunctionComponent<Props> = ({
  bold = false,
  children,
  className,
  color,
  colorMode,
  fullWidth = false,
  height,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  size = 'md',
  title,
  textAlign = 'center',
  truncate = false,
  width,
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
        fullWidth && styles.headingFullWidth,
        truncate && styles.headingTruncate,
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
    </h1>
  );
};

export default Heading;
