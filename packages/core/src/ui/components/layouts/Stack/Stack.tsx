import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { StackProps } from '@/ui/types';

const Stack: FunctionComponent<StackProps> = ({
  align = 'start',
  className,
  direction = 'horizontal',
  children,
  fullHeight = false,
  fullWidth = false,
  grow = false,
  height,
  justify = 'start',
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingX,
  paddingY,
  spacing,
  width,
}) => {
  // memos
  const alignStyle = useMemo(() => {
    switch (align) {
      case 'center':
        return styles.stackAlignCenter;
      case 'end':
        return styles.stackAlignEnd;
      case 'start':
      default:
        return styles.stackAlignStart;
    }
  }, [align]);
  const justifyStyle = useMemo(() => {
    switch (justify) {
      case 'between':
        return styles.stackJustifyBetween;
      case 'center':
        return styles.stackJustifyCenter;
      case 'end':
        return styles.stackJustifyEnd;
      case 'evenly':
        return styles.stackJustifyEvenly;
      case 'start':
      default:
        return styles.stackJustifyStart;
    }
  }, [justify]);
  const spacingStyle = useMemo(() => {
    switch (spacing) {
      case 'xs':
        return styles.stackSpacingXs;
      case 'sm':
        return styles.stackSpacingSm;
      case 'md':
        return styles.stackSpacingMd;
      case 'lg':
        return styles.stackSpacingLg;
      case 'xl':
        return styles.stackSpacingXl;
      default:
        return null;
    }
  }, [spacing]);

  return (
    <div
      className={clsx(
        className,
        styles.stack,
        alignStyle,
        justifyStyle,
        spacingStyle,
        direction === 'vertical'
          ? styles.stackVertical
          : styles.stackHorizontal,
        fullHeight && styles.stackFullHeight,
        fullWidth && styles.stackFullWidth,
        grow && styles.stackGrow
      )}
      style={{
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
        ...(padding && {
          padding:
            typeof padding === 'number'
              ? `${padding}px ${padding}px ${padding}px ${padding}px`
              : `${padding} ${padding} ${padding} ${padding}`,
        }),
        ...(paddingBottom && {
          paddingBottom:
            typeof paddingBottom === 'number'
              ? `${paddingBottom}px`
              : paddingBottom,
        }),
        ...(paddingLeft && {
          paddingLeft:
            typeof paddingLeft === 'number' ? `${paddingLeft}px` : paddingLeft,
        }),
        ...(paddingRight && {
          paddingRight:
            typeof paddingRight === 'number'
              ? `${paddingRight}px`
              : paddingRight,
        }),
        ...(paddingTop && {
          paddingTop:
            typeof paddingTop === 'number' ? `${paddingTop}px` : paddingTop,
        }),
        ...(paddingX && {
          paddingLeft:
            typeof paddingX === 'number' ? `${paddingX}px` : paddingX,
          paddingRight:
            typeof paddingX === 'number' ? `${paddingX}px` : paddingX,
        }),
        ...(paddingY && {
          paddingBottom:
            typeof paddingY === 'number' ? `${paddingY}px` : paddingY,
          paddingTop: typeof paddingY === 'number' ? `${paddingY}px` : paddingY,
        }),
        ...(width && {
          width: typeof height === 'number' ? `${width}px` : width,
        }),
      }}
    >
      {children}
    </div>
  );
};

export default Stack;
