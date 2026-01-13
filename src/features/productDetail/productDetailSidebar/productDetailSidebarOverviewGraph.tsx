import { FC } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { Product } from '../../../models';
import { selectTheme } from '../../themes/themeSlice';
import { ProductItemOverviewGraph } from '../../shared';

import styles from './productDetailSidebarGraph.module.scss';

interface ProductDetailSidebarOverviewGraphProps {
  product: Product;
}

export const ProductDetailSidebarOverviewGraph: FC<
  ProductDetailSidebarOverviewGraphProps
> = ({ product }) => {
  const isDarkTheme = useAppSelector(selectTheme);

  return (
    <div className={styles['product-detail-sidebar-graph']}>
      <ProductItemOverviewGraph
        data={product.overview}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
};
