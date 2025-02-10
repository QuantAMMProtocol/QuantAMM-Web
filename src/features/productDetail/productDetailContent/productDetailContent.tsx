import { FC } from 'react';
import { Layout } from 'antd';
import { Product } from '../../../models';
import { ProductDetailPoolGraph } from './productDetailPoolGraph';
import { ProductDetailStats } from './productDetailStats';
import { ProductDetailNav } from './productDetailNav';
import { ProductDetailEvents } from './productDetailEvents';

import sharedStyles from '../../../shared.module.scss';

const { Content } = Layout;

interface ProductDetailContentProps {
  product: Product;
}

export const ProductDetailContent: FC<ProductDetailContentProps> = ({
  product,
}) => {
  return (
    <Content>
      <ProductDetailNav product={product} />
      <div className={sharedStyles.scrollable}>
        <ProductDetailPoolGraph product={product} />
        <ProductDetailStats product={product} />
        <ProductDetailEvents product={product} />
      </div>
    </Content>
  );
};
