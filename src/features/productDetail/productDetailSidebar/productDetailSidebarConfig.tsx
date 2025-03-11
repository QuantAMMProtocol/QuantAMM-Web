import { FC } from 'react';
import { Product } from '../../../models';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

interface ProductDetailSidebarConfigProps {
  product: Product;
}

export const ProductDetailSidebarConfig: FC<
  ProductDetailSidebarConfigProps
> = ({ product }) => {
  const formatter = Intl.NumberFormat('en');

  return (
    <div className={styles['product-detail-info__container']}>
      <ProductDetailSidebarElement side="left" text="Token Decimal" />
      <ProductDetailSidebarElement
        side="right"
        text={String(product.decimals)}
      />

      <ProductDetailSidebarElement side="left" text="Has Dynamic Swap Fee" />
      <ProductDetailSidebarElement side="right" text="TODO" />

      <ProductDetailSidebarElement
        side="left"
        text="Static Swap Fee Percentage"
      />
      <ProductDetailSidebarElement
        side="right"
        text={formatter.format(Number(product.dynamicData?.swapFee))}
      />

      <ProductDetailSidebarElement side="left" text="Is Pool Paused" />
      <ProductDetailSidebarElement
        side="right"
        text={product.dynamicData?.isPaused ? 'true' : 'false'}
      />

      <ProductDetailSidebarElement side="left" text="Pause Window End Time" />
      <ProductDetailSidebarElement side="right" text="TODO" />

      <ProductDetailSidebarElement
        side="left"
        text="Is Pool in Recovery Mode"
      />
      <ProductDetailSidebarElement
        side="right"
        text={product.dynamicData?.isInRecoveryMode ? 'true' : 'false'}
      />
    </div>
  );
};
