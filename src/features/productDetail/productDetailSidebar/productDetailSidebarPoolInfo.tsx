import { FC } from 'react';
import { Product } from '../../../models';
import { shortenAddress } from '../../../utils';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

interface ProductDetailSidebarPoolInfoProps {
  product: Product;
}

export const ProductDetailSidebarPoolInfo: FC<
  ProductDetailSidebarPoolInfoProps
> = ({ product }) => {
  const formatter = Intl.NumberFormat('en');

  return (
    <div className={styles['product-detail-info__container']}>
      <ProductDetailSidebarElement
        side="left"
        text="Strategy runner contract"
      />
      <ProductDetailSidebarElement
        side="right"
        href="0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
        target="_blank"
        text="Etherscan"
      />
      <ProductDetailSidebarElement side="left" text="Base pool contract" />
      <ProductDetailSidebarElement
        side="right"
        href="0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
        target="_blank"
        text="Etherscan"
      />
      <ProductDetailSidebarElement
        side="left"
        text="Strategy update interval"
      />
      <ProductDetailSidebarElement side="right" text={product.frequency} />
      <ProductDetailSidebarElement side="left" text="Fee 24h" />
      <ProductDetailSidebarElement
        side="right"
        text={formatter.format(Number(product.dynamicData?.fees24h))}
      />
      <ProductDetailSidebarElement side="left" text="Swap fee" />
      <ProductDetailSidebarElement
        side="right"
        text={formatter.format(Number(product.dynamicData?.swapFee))}
      />
      <ProductDetailSidebarElement side="left" text="Swap Fee Manager" />
      <ProductDetailSidebarElement
        side="right"
        text={product.swapManager?.valueOf().toString() ?? 'false'}
      />
      <ProductDetailSidebarElement side="left" text="Pause Manager" />
      <ProductDetailSidebarElement
        side="right"
        text={product.pauseManager?.valueOf().toString() ?? 'false'}
      />
      <ProductDetailSidebarElement
        side="left"
        text="Disable Unbalanced Liquidity"
      />
      <ProductDetailSidebarElement
        side="right"
        text={
          product.disableUnbalancedLiquidity?.valueOf().toString() ?? 'false'
        }
      />
      <ProductDetailSidebarElement side="left" text="Add Liquidity Custom" />
      <ProductDetailSidebarElement
        side="right"
        text={product.enableAddLiquidityCustom?.valueOf().toString() ?? 'false'}
      />
      <ProductDetailSidebarElement side="left" text="Remove Liquidity Custom" />
      <ProductDetailSidebarElement
        side="right"
        text={
          product.enableRemoveLiquidityCustom?.valueOf().toString() ?? 'false'
        }
      />
      <ProductDetailSidebarElement side="left" text="Pool Address" />
      <ProductDetailSidebarElement
        side="right"
        text={shortenAddress(product.id)}
        href={'https://etherscan.io/address/' + product.address}
      />
      <ProductDetailSidebarElement side="left" text="Creation Date" />
      <ProductDetailSidebarElement side="right" text={product.createTime} />
    </div>
  );
};
