import { FC } from 'react';
import { Col, Layout, Row } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import { selectProductById } from '../../productExplorer/productExplorerSlice';
import { ProductDetailPoolGraph } from './productDetailPoolGraph';
import { ProductDetailStats } from './productDetailStats';
import { ProductDetailNav } from './productDetailNav';
import { ProductDetailEvents } from './productDetailEvents';

import sharedStyles from '../../../shared.module.scss';
import { ProductDetailInfo } from '../productDetailSidebar/productDetailInfo';
import { GqlChain } from '../../../__generated__/graphql-types';

const { Content } = Layout;

interface ProductDetailContentProps {
  id: string;
  isMobile?: boolean;
  isTablet?: boolean;
}

export const ProductDetailContent: FC<ProductDetailContentProps> = ({
  id,
  isMobile,
  isTablet,
}) => {
  const product = useAppSelector((state) => selectProductById(state, id));
  return (
    <Content>
      {product?.id && product.id !== '' && (
        <>
          <ProductDetailNav productId={product.id} chain={product.chain} />
          <div className={sharedStyles.scrollable}>
            <ProductDetailPoolGraph productId={product.id} />
            {isMobile ? (
              <ProductDetailInfo product={product} isMobile={isMobile} />
            ) : isTablet ? (
              <Row>
                <Col span={4}></Col>
                <Col span={16}>
                  <ProductDetailInfo product={product} isMobile={isMobile} />
                </Col>
                <Col span={4}></Col>
              </Row>
            ) : (
              <></>
            )}
            <Row>
              <Col span={24}>
                <ProductDetailStats productId={product.id} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <ProductDetailEvents
                  productId={product.id}
                  chain={product.chain as GqlChain}
                />
              </Col>
            </Row>
          </div>
        </>
      )}
    </Content>
  );
};
