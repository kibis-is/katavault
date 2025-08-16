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

const SettingsTextCard: FunctionComponent<Props> = ({
  colorMode,
  subtitle,
  title,
  value,
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <HStack align="center" className={clsx(styles.content)} fullWidth={true} spacing="xs">
        {/*title/subtitle*/}
        <VStack align="center" fullWidth={true} justify="evenly" spacing="xs">
          <Heading color={defaultTextColor} colorMode={colorMode} fullWidth={true} size="sm" textAlign="left">
            {title}
          </Heading>

          {subtitle && (
            <Text color={subTextColor} colorMode={colorMode} fullWidth={true} size="sm" textAlign="left">
              {subtitle}
            </Text>
          )}
        </VStack>

        {/*value*/}
        {value && (
          <Stack align="center" maxWidth="25%" justify="center">
            <Text color={defaultTextColor} colorMode={colorMode} fullWidth={true} size="sm" textAlign="right">
              {value.toString()}
            </Text>
          </Stack>
        )}
      </HStack>
    </div>
  );
};

export default SettingsTextCard;
