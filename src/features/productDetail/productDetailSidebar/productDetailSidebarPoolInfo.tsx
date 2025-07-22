import { FC } from 'react';
import { Product } from '../../../models';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

interface ProductDetailSidebarPoolInfoProps {
  product: Product;
}

export const ProductDetailSidebarPoolInfo: FC<
  ProductDetailSidebarPoolInfoProps
> = ({ product }) => {
  const formatter = Intl.NumberFormat('en');

  const strategyRunnerContractAddresses: Record<string, string> = {
    MAINNET: "0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748",
    BASE: "0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7",
    ARBITRUM: "0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7",
    SONIC: "0xD5c43063563f9448cE822789651662cA7DcD5773",
  };

  const factoryAddress: Record<string, string> = {
    MAINNET: "0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748",
    BASE: "0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7",
    ARBITRUM: "0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7",
    SONIC: "0x60006d255569b36a3d494e83D182b57acd04D484",
  };

  const expolerRootUrl: Record<string, string> = {
    MAINNET: "https://etherscan.io",
    BASE: "https://basescan.org",
    ARBITRUM: "https://arbiscan.io",
    SONIC:'https://sonicscan.org',
  };

  return (
    <div className={styles['product-detail-info__container']}>
      <ProductDetailSidebarElement
        side="left"
        text="Strategy runner contract"
      />
      <ProductDetailSidebarElement
        side="right"
        href={expolerRootUrl[product.chain] + "/address/" + strategyRunnerContractAddresses[product.chain]}
        target="_blank"
        text="Contract"
      />
      <ProductDetailSidebarElement side="left" text="Pool Factory contract" />
      <ProductDetailSidebarElement
        side="right"
        href={expolerRootUrl[product.chain] + "/address/" + factoryAddress[product.chain]} 
        target="_blank"
        text="Contract"
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
      <ProductDetailSidebarElement side="left" text="Creation Date" />
      <ProductDetailSidebarElement side="right" text={product.createTime} />
    </div>
  );
};
