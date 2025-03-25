import { Popover, Typography } from 'antd';
import { isLBP } from '../../../../../utils/poolHelpers';
import { Product } from '../../../../../models';
import { GqlChain } from '../../../../../__generated__/graphql-types';
import { getTotalAprLabel, isProduct } from './pool.utils';
import { BaseAprTooltip, BaseAprTooltipProps } from './BaseAprTooltip';
import { SparklesIcon } from './SparklesIcon';

import style from './AprTooltip.module.scss';

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
  onlySparkles?: boolean;
  aprLabel?: boolean;
  apr?: string;
  height?: string;
  product: Product;
  id?: string;
}

function MainAprTooltip({
  onlySparkles,
  apr,
  vebalBoost,
  aprLabel,
  product,
  id,
  ...props
}: Props) {
  const aprToShow =
    apr ??
    (product.dynamicData?.aprItems &&
      getTotalAprLabel(product.dynamicData?.aprItems, vebalBoost));

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
      hookType={isProduct(product) ? product.hook?.type : undefined}
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
            <SparklesIcon id={id} isOpen={isOpen} product={product} />
          </div>
        </div>
      )}
    </BaseAprTooltip>
  );
}

export default MainAprTooltip;
