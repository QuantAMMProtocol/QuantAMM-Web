import BaseAprTooltip, { BaseAprTooltipProps } from './BaseAprTooltip';
import { getTotalAprLabel } from './pool.utils';
// import StarsIcon from '../../icons/StarsIcon';
// import { PoolListItem } from '@repo/lib/modules/pool/pool.types';
// import { FeaturedPool } from '@repo/lib/modules/pool/PoolProvider';
// import { Pool } from '@repo/lib/modules/pool/pool.types';
import { isLBP } from '../../../../../utils/poolHelpers';
// import { GqlPoolAprItemType } from '@repo/lib/shared/services/api/generated/graphql';
// import StarIcon from '../../icons/StarIcon';
// import { PROJECT_CONFIG } from '@repo/lib/config/getProjectConfig';
// import { isPool } from '@repo/lib/modules/pool/pool-tokens.utils';
import { Product } from '../../../../../models';
// import { useAppSelector } from '../../../../../app/hooks';
// import { selectTheme } from '../../../../themes/themeSlice';
// import { Box, Icon, Info } from 'lucide-react';
import { GqlChain } from '../../../../../__generated__/graphql-types';
import { Popover, Typography } from 'antd';
import { SparklesIcon } from './SparklesIcon';

import style from './AprTooltip.module.scss';
import { useAppSelector } from '../../../../../app/hooks';
import { selectTheme } from '../../../../themes/themeSlice';

const { Text } = Typography;

interface Props
  extends Omit<
    BaseAprTooltipProps,
    | 'children'
    | 'totalBaseText'
    | 'totalBaseVeBalText'
    | 'maxVeBalText'
    | 'poolType'
  > {
  // textProps?: TextProps;
  onlySparkles?: boolean;
  aprLabel?: boolean;
  apr?: string;
  height?: string;
  product: Product;
  id?: string;
}

function MainAprTooltip({
  onlySparkles,
  // textProps,
  apr,
  vebalBoost,
  aprLabel,
  // height = '16px',
  product,
  id,
  ...props
}: Props) {
  const isDark = useAppSelector(selectTheme);

  const aprToShow =
    apr ??
    (product.dynamicData?.aprItems &&
      getTotalAprLabel(product.dynamicData?.aprItems, vebalBoost));

  // const hoverColor = isLBP(product.type) ? 'inherit' : 'font.highlight';

  const customPopoverContent = isLBP(product.type) ? (
    <Popover>
      <Text>LBP APRs cannot be realized by LPs.</Text>
    </Popover>
  ) : undefined;

  return (
    <BaseAprTooltip
      {...props}
      chain={product.chain as GqlChain}
      customPopoverContent={customPopoverContent}
      // hookType={isPool(product) ? product.hook?.type : undefined}
      maxVeBalText="Total max veBAL APR"
      poolType={product.type}
      totalBaseText={(hasVeBalBoost) =>
        `Total ${hasVeBalBoost ? 'base' : ''} APR`
      }
      totalBaseVeBalText="Total base APR"
      vebalBoost={vebalBoost}
    >
      {({ isOpen }) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={style['apr-tooltip-container']}>
            {!onlySparkles && (
              <Text className={style['apr-text']}>
                {apr ?? aprToShow}
                {aprLabel ? ' APR' : ''}
              </Text>
            )}
            <SparklesIcon
              id={id}
              isOpen={isOpen}
              product={product}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </BaseAprTooltip>
  );
}

export default MainAprTooltip;
