import { FC, memo, useMemo, useRef } from 'react';
import { Col, Empty, Row, Spin } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GqlChain, GqlPoolEvent } from '../../../__generated__/graphql-types';
import { useFetchPoolEventsData } from '../../../hooks/useFetchPoolEventsData';
import { useAppSelector } from '../../../app/hooks';
import { selectAgGridTheme, selectAgChartTheme } from '../../themes/themeSlice';
import { selectProductById } from '../../productExplorer/productExplorerSlice';
import { CURRENT_LIVE_FACTSHEETS } from '../../documentation/factSheets/liveFactsheets';

import { ProductDetailEventsHeader } from './productDetailEventsHeader';
import { ProductDetailEventsGrid } from './productDetailEventsGrid';
import { ProductDetailEventsHeatmap } from './productDetailEventsHeatmap';
import { useExplorerBase } from './productDetailUseExplorerBase';
import { useBadgeThresholds } from './productDetailUseBadgeThresholds';
import { useHeatmapData } from './productDetailUseHeatmapData';
import styles from './productDetailEvents.module.scss';

export interface ProductDetailEventsProps {
  productId: string;
  chain: GqlChain;
  isMobile?: boolean;
}

export const ProductDetailEvents: FC<ProductDetailEventsProps> = memo(function ProductDetailEventsImpl({
  productId,
  chain,
  isMobile,
}: ProductDetailEventsProps) {
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const chartTheme = useAppSelector(selectAgChartTheme);

  const product = useAppSelector((s) => selectProductById(s, productId));
  const productAddress = product?.address?.toLowerCase() ?? '';
  const livePools = CURRENT_LIVE_FACTSHEETS;

  const { poolEvents, loading, error } = useFetchPoolEventsData({
    first: 1000,
    skip: undefined,
    poolId: productId,
    chain,
  });

  const explorerBase = useExplorerBase(chain);
  const thresholds = useBadgeThresholds(productAddress, livePools);
  const gridRef = useRef<AgGridReact<GqlPoolEvent>>(null);

  const rowData = useMemo(
    () =>
      (poolEvents ?? []).map(({ blockNumber, id, sender, timestamp, tx, type, valueUSD }) => ({
        id,
        blockNumber,
        type,
        sender,
        tx,
        timestamp,
        valueUSD,
      })),
    [poolEvents]
  );

  const showSpinner = loading && !error && rowData.length === 0;

  const heatmap = useHeatmapData(product, poolEvents);

  return (
    <Row id="events" className={styles.eventsRow}>
      <Col span={24} className={styles.headerCol}>
        <ProductDetailEventsHeader
          isMobile={!!isMobile}
          onCsv={() => gridRef.current?.api?.exportDataAsCsv()}
        />
      </Col>

      <Col span={24} className={styles.contentCol}>
        {showSpinner ? (
          <Spin />
        ) : error && rowData.length === 0 ? (
          <div>Failed to load events.</div>
        ) : isMobile ? (
          <div className={styles.contentFullWidth}>
            {!heatmap.heatmapData.length ? (
              <Empty description="No swap data" />
            ) : (
              <ProductDetailEventsHeatmap
                chartTheme={chartTheme}
                data={heatmap.heatmapData}
                xDomain={heatmap.xDomain}
                yDomain={heatmap.yDomain}
                addrNameMap={heatmap.addrNameMap}
              />
            )}
          </div>
        ) : (
          <div className={styles.contentFullWidth}>
            <div className={`${darkThemeAg} ${styles.gridWrapper}`}>
              <ProductDetailEventsGrid
                ref={gridRef}
                rowData={rowData}
                explorerBase={explorerBase}
                thresholds={thresholds}
              />
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
});
