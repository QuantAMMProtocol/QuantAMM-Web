import { FC, memo } from 'react';
import { GqlChain } from '../../../../__generated__/graphql-types';
import { Product } from '../../../../models';
import MainAprTooltip from '../shared/apr/MainAprTooltip';

import styles from './productItemApr.module.scss';

interface ProductItemAprProps {
  product: Product;
}

const MemoizedMainAprTooltip = memo(MainAprTooltip);

export const ProductItemApr: FC<ProductItemAprProps> = ({ product }) => {
  return product.dynamicData?.aprItems?.length ? (
    <div className={styles['product-item-apr']}>
      <MemoizedMainAprTooltip
        aprItems={product.dynamicData?.aprItems}
        chain={product.chain as GqlChain}
        height="auto"
        product={product}
        poolId={product.id}
        // textProps={{ fontWeight: 'medium', textAlign: 'right' }}
      />
    </div>
  ) : (
    <></>
  );
};
