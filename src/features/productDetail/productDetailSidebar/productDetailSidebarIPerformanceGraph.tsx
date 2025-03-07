import { FC } from 'react';
import { Product } from '../../../models';
import { ProductItemPerformanceAreaGraph } from '../../productExplorer/productItem/card/productItemPerformanceAreaGraph';

import styles from './productDetailSidebarGraph.module.scss';

interface ProductDetailSidebarOverviewGraphProps {
  product: Product;
}

export const ProductDetailSidebarPerformanceGraph: FC<
  ProductDetailSidebarOverviewGraphProps
> = ({ product }) => {
  return (
    <div className={styles['product-detail-sidebar-graph']}>
      {product.oneWeekPerformance &&
        product.oneMonthPerformance &&
        product.threeMonthPerformance &&
        product.sixMonthPerformance &&
        product.oneYearPerformance &&
        product.inceptionPerformance && (
          <ProductItemPerformanceAreaGraph
            data={[
              product.oneWeekPerformance,
              product.oneMonthPerformance,
              product.threeMonthPerformance,
              product.sixMonthPerformance,
              product.oneYearPerformance,
              product.inceptionPerformance,
            ]}
            wide={false}
          />
        )}
    </div>
  );
};
