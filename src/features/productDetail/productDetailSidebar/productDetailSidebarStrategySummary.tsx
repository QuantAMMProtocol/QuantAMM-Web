import { FC } from 'react';
import { Product } from '../../../models';
import { Eli5 } from '../../shared';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';
import { CURRENT_LIVE_FACTSHEETS } from '../../documentation/factSheets/liveFactsheets';

import styles from './productDetailInfo.module.scss';
import Title from 'antd/es/typography/Title';
import { Collapse } from 'antd';

interface ProductDetailSidebarStrategySummaryProps {
  product: Product;
}

export const ProductDetailSidebarStrategySummary: FC<
  ProductDetailSidebarStrategySummaryProps
> = ({ product }) => {
  const livePools = CURRENT_LIVE_FACTSHEETS;
  const liveProduct = livePools.factsheets.find(
    (p) => p.poolId.toLowerCase() == product.address.toLowerCase()
  );
  const strategyName = liveProduct?.fixedSettings.find(
    (x) => x[0] == 'Strategy'
  )?.[1];
  return (
    <>
      <Collapse
        items={[
          {
        key: 'strategy',
        label: `About ${strategyName ?? ''} Strategy`,
        children: (
          <>
            <ProductDetailSidebarElement
          side="left"
          insideTag={false}
          text={
            <Eli5
              strategy={
            product.strategy == 'NONE'
              ? product.tokenType
              : product.strategy
              }
            />
          }
            />
          </>
        ),
          },
        ]}
      />
    </>
  );
};
