// productDetailStats.tsx
import { FC, memo } from 'react';
import { Col, Grid, Row, Spin } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import {
  selectLoadingSimulationRunBreakdown,
  selectProductById,
} from '../../productExplorer/productExplorerSlice';
import { ProductDetailSummary } from './summary/productDetailSummary';
import styles from './productDetailStats.module.scss';

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
      <Row id="details" className={styles.detailsRow}>
        <Col span={24} className={styles.detailsCol}>
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
