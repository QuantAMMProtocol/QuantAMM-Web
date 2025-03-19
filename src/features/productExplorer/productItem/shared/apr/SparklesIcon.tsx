import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { StarIcon, StarsIcon } from 'lucide-react';
import { GqlPoolAprItemType } from '../../../../../__generated__/graphql-types';
import { Product } from '../../../../../models';
import { isLBP } from '../../../../../utils/poolHelpers';

export const SparklesIcon = ({
  isOpen,
  product,
  id,
  isDark,
}: {
  isOpen: boolean;
  product: Product;
  id?: string;
  isDark: boolean;
}) => {
  const hoverColor = isLBP(product.type)
    ? 'inherit'
    : 'var(--secondary-text-color)';

  const hasRewardApr =
    (product.dynamicData?.aprItems ?? []).filter((item) =>
      [GqlPoolAprItemType.Staking, GqlPoolAprItemType.VebalEmissions].includes(
        item.type
      )
    ).length > 0;

  const hasOnlySwapApr =
    (product.dynamicData?.aprItems ?? []).filter(
      (item) => item.type === GqlPoolAprItemType.SwapFee_24H
    ).length === (product.dynamicData?.aprItems ?? []).length;

  //   const defaultGradFrom = isDark ? '#A0AEC0' : '#91A1B6';
  //   const defaultGradTo = isDark ? '#BCCCE1' : '#E9EEF5';

  //   const corePoolGradFrom = isDark ? '#AE8C56' : '#BFA672';
  //   const corePoolGradTo = isDark ? '#D9C47F' : '#F4EAD2';

  //   const rewardsGradFrom = isDark ? '#F49175' : '#F49A55';
  //   const rewardsGradTo = isDark ? '#FCD45B' : '#FFCC33';

  //   let gradFromColor = defaultGradFrom;
  //   let gradToColor = defaultGradTo;

  //   TODO check if this is correct
  //   if (product.id === PROJECT_CONFIG.corePoolId) {
  //     gradFromColor = corePoolGradFrom;
  //     gradToColor = corePoolGradTo;
  //   }

  //   if (hasRewardApr) {
  //     gradFromColor = rewardsGradFrom;
  //     gradToColor = rewardsGradTo;
  //   }

  return (
    <div style={{ height: 'auto', minWidth: '12px', width: '12px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '12px',
        }}
      >
        {isLBP(product.type) ? (
          <InfoCircleOutlined color={isOpen ? hoverColor : 'var(--gray-400)'} />
        ) : hasOnlySwapApr ? (
          <Icon
            component={StarIcon}
            // boxSize={4}
            // gradFrom={isOpen ? 'green' : defaultGradFrom}
            // gradTo={isOpen ? 'green' : defaultGradTo}
            id={id ?? ''}
          />
        ) : (
          <Icon
            component={StarsIcon}
            // gradFrom={isOpen ? 'green' : gradFromColor}
            // gradTo={isOpen ? 'green' : gradToColor}
            id={id ?? ''}
          />
        )}
      </div>
    </div>
  );
};
