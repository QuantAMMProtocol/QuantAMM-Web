import { FC } from 'react';
import { PerformancePeriod, Product } from '../../../models';
import { ProductItemPerformanceAreaGraph } from '../../productExplorer/productItem/card/productItemPerformanceAreaGraph';

import styles from './productDetailSidebarGraph.module.scss';

interface ProductDetailSidebarOverviewGraphProps {
  product: Product;
}

export const ProductDetailSidebarPerformanceGraph: FC<
  ProductDetailSidebarOverviewGraphProps
> = ({ product }) => {
  const performanceLength = (product.dailyPerformance?.length ?? 0);
  const performancePeriod:PerformancePeriod = {sharePrice: 0, return: 0};
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
              performanceLength >= 7 ? product.oneWeekPerformance : performancePeriod,
              performanceLength >= 30 ? product.oneMonthPerformance : performancePeriod,
              performanceLength >= 90 ? product.threeMonthPerformance : performancePeriod,
              performanceLength >= 180 ? product.sixMonthPerformance : performancePeriod,
              performanceLength >= 365 ? product.oneYearPerformance : performancePeriod,
              product.inceptionPerformance,
            ]}
            wide={false}
          />
        )}
    </div>
  );
};
