// productDetailStats.tsx
import { FC, memo } from 'react';
import { Col, Grid, Row, Spin } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import {
  selectLoadingJsonBreakdown,
  selectLoadingSimulationRunBreakdown,
  selectProductById,
} from '../../productExplorer/productExplorerSlice';
import { ProductDetailSummary } from './summary/productDetailSummary';
import { ProductDetailTable } from './components/productDetailTable';

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
  const loadingBreakdowns = useAppSelector(selectLoadingJsonBreakdown);
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

  const hasBreakdown =
    !!product.simulationRunBreakdown &&
    Object.keys(product.simulationRunBreakdown).length > 0;

  const isLoadingForThisProduct =
    !hasBreakdown && (loadingSimulationRunBreakdown || loadingBreakdowns);

  return (
    <>
      <ProductDetailSummary
        product={product}
        loadingSimulationRunBreakdown={loadingSimulationRunBreakdown}
        isMobile={isMobile}
      />

      <Row id="details" style={{ marginTop: 20 }} hidden={isMobile}>
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
          {isLoadingForThisProduct ? (
            <Spin />
          ) : hasBreakdown ? (
            <ProductDetailTable
              simulationRunBreakdown={product.simulationRunBreakdown}
              productId={product.address ?? productId}
              isMobile={isMobile}
            />
          ) : (
            <div>No breakdown data available.</div>
          )}
        </Col>
      </Row>
    </>
  );
};

export const ProductDetailStats = memo(ProductDetailStatsInternal);
