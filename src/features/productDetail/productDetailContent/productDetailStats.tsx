import { FC } from 'react';
import { Col, Grid, Row, Spin } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import { Product } from '../../../models';
import { selectLoadingSimulationRunBreakdown } from '../../productExplorer/productExplorerSlice';
import { ProductDetailSummary } from './summary/productDetailSummary';
import { ProductDetailTable } from './components/productDetailTable';

const { useBreakpoint } = Grid;

interface ProductDetailStatsProps {
  product: Product;
}

export const ProductDetailStats: FC<ProductDetailStatsProps> = ({
  product,
}) => {
  const loadingSimulationRunBreakdown = useAppSelector((state) =>
    selectLoadingSimulationRunBreakdown(state, product.id)
  );

  const screens = useBreakpoint();

  return (
    <>
      <ProductDetailSummary
        product={product}
        loadingSimulationRunBreakdown={loadingSimulationRunBreakdown}
        isMobile={!screens.lg && !screens.xl && !screens.xxl}
      />

      <Row id="details" style={{ marginTop: 20 }}>
        
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            paddingLeft: 12,
          }}
        >
          {loadingSimulationRunBreakdown ? (
            <Spin />
          ) : (
            <ProductDetailTable
              simulationRunBreakdown={product.simulationRunBreakdown}
              productId= {product.address}
            />
          )}
        </Col>
      </Row>
    </>
  );
};
