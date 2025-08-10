import type { FunctionComponent } from 'preact';

// components
import HStack from '@/ui/components/layouts/HStack';
import Link from '@/ui/components/typography/Link';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// constants
import { DEFAULT_PADDING, KATAVAULT_URL } from '@/ui/constants';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import BannerIcon from '@/ui/icons/BannerIcon';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';

const Footer: FunctionComponent<BaseComponentProps> = ({ colorMode }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const translate = useTranslate();

  return (
    <VStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING}>
      <HStack align="center" justify="center" spacing="sm">
        <Text colorMode={colorMode} size="xs" textAlign="center">
          {translate('captions.poweredBy')}
        </Text>

        <Link colorMode={colorMode} href={KATAVAULT_URL} isExternal={true}>
          <BannerIcon className={styles.footerIcon} color={defaultTextColor} />
        </Link>
      </HStack>
    </VStack>
  );
};

export default Footer;
