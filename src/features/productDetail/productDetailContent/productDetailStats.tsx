// productDetailStats.tsx
import { FC, memo } from 'react';
import { Col, Grid, Row, Spin } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import {
  selectLoadingSimulationRunBreakdown,
  selectProductById,
} from '../../productExplorer/productExplorerSlice';
import { ProductDetailSummary } from './summary/productDetailSummary';

const { useBreakpoint } = Grid;

interface ProductDetailStatsProps {
  productId: string;
}

const ProductDetailStatsInternal: FC<ProductDetailStatsProps> = ({
  productId,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;
  const product = useAppSelector((state) =>
    selectProductById(state, productId)
  );
  const loadingSimulationRunBreakdown = useAppSelector((state) =>
    selectLoadingSimulationRunBreakdown(state, productId)
  );

  if (!product) {
    return (
      <Row id="details" style={{ marginTop: 20 }}>
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            paddingLeft: 12,
          }}
        >
          <Spin />
        </Col>
      </Row>
    );
  }

  return (
    <>
      <ProductDetailSummary
        product={product}
        loadingSimulationRunBreakdown={loadingSimulationRunBreakdown}
        isMobile={isMobile}
      />
    </>
  );
};

export const ProductDetailStats = memo(ProductDetailStatsInternal);
