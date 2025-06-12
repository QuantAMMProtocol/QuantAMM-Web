import { FC } from 'react';
import { Col, Layout, Row } from 'antd';
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
import { ProductDetailInfo } from '../productDetailSidebar/productDetailInfo';

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
  const product = selectProductById(useAppSelector(selectProducts), id);
  return (
    <Content>
      {product && (
        <>
          <ProductDetailNav product={product} />
          <div className={sharedStyles.scrollable}>
            <ProductDetailPoolGraph product={product} />
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
                <ProductDetailStats product={product} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <ProductDetailEvents product={product} />
              </Col>
            </Row>
          </div>
        </>
      )}
    </Content>
  );
};
