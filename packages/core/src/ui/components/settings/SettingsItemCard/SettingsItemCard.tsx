import clsx from 'clsx';
import { type FunctionComponent } from 'preact';

// components
import Heading from '@/ui/components/typography/Heading';
import HStack from '@/ui/components/layouts/HStack';
import Stack from '@/ui/components/layouts/Stack';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';
import useSubTextColor from '@/ui/hooks/colors/useSubTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const SettingsItemCard: FunctionComponent<Props> = ({
  colorMode,
  item,
  subtitle,
  title,
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <HStack align="center" className={clsx(styles.content)} fullWidth={true} spacing="xs">
        {/*title/subtitle*/}
        <VStack align="center" fullWidth={true} justify="evenly" spacing="xs">
          <Heading color={defaultTextColor} colorMode={colorMode} fullWidth={true} size="xs" textAlign="left">
            {title}
          </Heading>

          {subtitle && (
            <Text color={subTextColor} colorMode={colorMode} fullWidth={true} size="xs" textAlign="left">
              {subtitle}
            </Text>
          )}
        </VStack>

        {/*item*/}
        <Stack align="center" maxWidth="25%" justify="center">
          {item}
        </Stack>
      </HStack>
    </div>
  );
};

export default SettingsItemCard;
