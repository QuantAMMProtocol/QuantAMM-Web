import { FC } from 'react';
import { Layout } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import {
  selectProductById,
  selectProducts,
} from '../../productExplorer/productExplorerSlice';
import { ProductDetailPoolGraph } from './productDetailPoolGraph';
import { ProductDetailStats } from './productDetailStats';
import { ProductDetailNav } from './productDetailNav';
import { ProductDetailEvents } from './productDetailEvents';

import sharedStyles from '../../../shared.module.scss';

const { Content } = Layout;

interface ProductDetailContentProps {
  id: string;
}

export const ProductDetailContent: FC<ProductDetailContentProps> = ({ id }) => {
  const product = selectProductById(useAppSelector(selectProducts), id);
  return (
    <Content>
      {product && (
        <>
          <ProductDetailNav product={product} />
          <div className={sharedStyles.scrollable}>
            <ProductDetailPoolGraph product={product} />
            <ProductDetailStats product={product} />
            <ProductDetailEvents product={product} />
          </div>
        </>
      )}
    </Content>
  );
};
