import { FC } from 'react';
import { Product } from '../../../models';
import { ProductItemCompositionGraph } from '../../shared';

import styles from './productDetailSidebarGraph.module.scss';

interface ProductDetailSidebarCompositionGraphProps {
  product: Product;
}

export const ProductDetailSidebarCompositionGraph: FC<
  ProductDetailSidebarCompositionGraphProps
> = ({ product }) => {
  return (
    <div className={styles['product-detail-sidebar-graph']}>
      <ProductItemCompositionGraph data={product.poolConstituents} />
    </div>
  );
};
