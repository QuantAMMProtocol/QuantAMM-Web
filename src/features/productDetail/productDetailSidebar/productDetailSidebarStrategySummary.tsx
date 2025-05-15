import { FC } from 'react';
import { Product } from '../../../models';
import { Eli5 } from '../../shared';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

interface ProductDetailSidebarStrategySummaryProps {
  product: Product;
}

export const ProductDetailSidebarStrategySummary: FC<
  ProductDetailSidebarStrategySummaryProps
> = ({ product }) => {
  return (
    <>
      <ProductDetailSidebarElement
        side="left"
        insideTag={false}
        text={
          <Eli5
            strategy={
              product.strategy == 'NONE' ? product.tokenType : product.strategy
            }
          />
        }
      />
      <div className={styles['product-detail-info__container']}>
        <ProductDetailSidebarElement
          side="left"
          href="/documentation"
          text="documentation"
        />
      </div>
    </>
  );
};
