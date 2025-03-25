import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { StarIcon, StarsIcon } from 'lucide-react';
import { GqlPoolAprItemType } from '../../../../../__generated__/graphql-types';
import { Product } from '../../../../../models';
import { isLBP } from '../../../../../utils/poolHelpers';

export const SparklesIcon = ({
  isOpen,
  product,
  id,
}: {
  isOpen: boolean;
  product: Product;
  id?: string;
}) => {
  const hoverColor = isLBP(product.type)
    ? 'inherit'
    : 'var(--secondary-text-color)';

  const hasOnlySwapApr =
    (product.dynamicData?.aprItems ?? []).filter(
      (item) => item.type === GqlPoolAprItemType.SwapFee_24H
    ).length === (product.dynamicData?.aprItems ?? []).length;

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
          <Icon component={StarIcon} id={id ?? ''} />
        ) : (
          <Icon component={StarsIcon} id={id ?? ''} />
        )}
      </div>
    </div>
  );
};
