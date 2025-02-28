import { FC } from 'react';
import { shortenAddress } from '../../../utils';
import { Product } from '../../../models';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

interface ProductDetailSidebarOverviewProps {
  product: Product;
}

export const ProductDetailSidebarOverview: FC<
  ProductDetailSidebarOverviewProps
> = ({ product }) => {
  const formatter = Intl.NumberFormat('en');

  return (
    <div className={styles['product-detail-info__container']}>
      <ProductDetailSidebarElement side="left" text="Pool ID" />
      <ProductDetailSidebarElement
        side="right"
        text={shortenAddress(product.id)}
        href={'https://etherscan.io/address/' + product.dynamicData?.poolId}
      />

      <ProductDetailSidebarElement side="left" text="Pool name" />
      <ProductDetailSidebarElement side="right" text={product.name} />

      <ProductDetailSidebarElement side="left" text="Pool symbol" />
      <ProductDetailSidebarElement side="right" text={product.symbol} />

      <ProductDetailSidebarElement side="left" text="Pool chain" />
      <ProductDetailSidebarElement side="right" text={product.chain} />

      <ProductDetailSidebarElement side="left" text="Pool type" />
      <ProductDetailSidebarElement
        side="right"
        text={product.strategy == 'NONE' ? product.tokenType : product.strategy}
      />

      <ProductDetailSidebarElement side="left" text="TVL" />
      <ProductDetailSidebarElement
        side="right"
        text={formatter.format(Number(product.dynamicData?.totalLiquidity))}
      />

      <ProductDetailSidebarElement side="left" text="Volume (24h)" />
      <ProductDetailSidebarElement
        side="right"
        text={formatter.format(Number(product.dynamicData?.volume24h))}
      />
    </div>
  );
};
