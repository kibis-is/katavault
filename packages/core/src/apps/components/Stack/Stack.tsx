import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// styles
import styles from './styles.module.scss';

// types
import type { StackProps } from '@/apps/types';

const Stack: FunctionComponent<StackProps> = ({
  align = 'start',
  className,
  direction = 'horizontal',
  children,
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
  let alignStyle = styles.stackAlignStart;
  let justifyStyle = styles.stackJustifyStart;
  let spacingStyle: string | null = null;

  switch (align) {
    case 'center':
      alignStyle = styles.stackAlignCenter;
      break;
    case 'end':
      alignStyle = styles.stackAlignEnd;
      break;
    case 'start':
    default:
      break;
  }

  switch (justify) {
    case 'between':
      justifyStyle = styles.stackJustifyBetween;
      break;
    case 'center':
      justifyStyle = styles.stackJustifyCenter;
      break;
    case 'end':
      justifyStyle = styles.stackJustifyEnd;
      break;
    case 'evenly':
      justifyStyle = styles.stackJustifyEvenly;
      break;
    case 'start':
    default:
      break;
  }

  switch (spacing) {
    case 'xs':
      spacingStyle = styles.stackSpacingXs;
      break;
    case 'sm':
      spacingStyle = styles.stackSpacingSm;
      break;
    case 'md':
      spacingStyle = styles.stackSpacingMd;
      break;
    case 'lg':
      spacingStyle = styles.stackSpacingLg;
      break;
    case 'xl':
      spacingStyle = styles.stackSpacingXl;
      break;
    default:
      break;
  }

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
