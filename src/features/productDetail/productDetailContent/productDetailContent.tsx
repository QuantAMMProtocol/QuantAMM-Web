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
import { ProductDetailSidebarSocials } from '../productDetailSidebar/productDetailSidebarSocials';
import { ProductDetailSidebarStrategySummary } from '../productDetailSidebar/productDetailSidebarStrategySummary';
import { ProductDetailTable } from './components/productDetailTable';
import styles from './productDetailContent.module.scss';

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
              <Col span={24} className={styles.strategyCol}>
                <ProductDetailSidebarStrategySummary product={product} />
              </Col>
            </Row>
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
                  isMobile={isMobile}
                />
              </Col>
            </Row>
            {!isMobile ? (
              <></>
            ) : (
              <Row id="details" className={styles.detailsRow} hidden={isMobile}>
                <Col span={24} className={styles.detailsCol}>
                  <ProductDetailTable
                    simulationRunBreakdown={product.simulationRunBreakdown}
                    productId={product.address ?? product.id}
                    isMobile={isMobile}
                  />
                </Col>
              </Row>
            )}
          </div>
          <div>
            <ProductDetailSidebarSocials />
          </div>
        </>
      )}
    </Content>
  );
};
