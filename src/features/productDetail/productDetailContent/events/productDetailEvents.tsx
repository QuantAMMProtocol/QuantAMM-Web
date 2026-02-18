import { FC, memo, useCallback, useRef, useState } from 'react';
import { Col, Collapse, Empty, Row, Spin } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  GqlChain,
  GqlPoolEvent,
} from '../../../../__generated__/graphql-types';
import { useFetchPoolEventsData } from '../../../../hooks/useFetchPoolEventsData';
import { useAppSelector } from '../../../../app/hooks';
import {
  selectAgGridTheme,
  selectAgChartTheme,
} from '../../../themes/themeSlice';
import { selectProductById } from '../../../productExplorer/productExplorerSlice';
import { CURRENT_LIVE_FACTSHEETS } from '../../../documentation/factSheets/liveFactsheets';

import { ProductDetailEventsHeader } from './productDetailEventsHeader';
import { ProductDetailEventsGrid } from './productDetailEventsGrid';
import { ProductDetailEventsHeatmap } from './productDetailEventsHeatmap';
import { useExplorerBase } from '../productDetailUseExplorerBase';
import { useBadgeThresholds } from '../productDetailUseBadgeThresholds';
import { useHeatmapData } from '../productDetailUseHeatmapData';
import styles from './productDetailEvents.module.scss';

export interface ProductDetailEventsProps {
  productId: string;
  chain: GqlChain;
  isMobile?: boolean;
}
const EVENTS_PANEL_KEY = 'events-panel';
const { Panel } = Collapse;

export const ProductDetailEvents: FC<ProductDetailEventsProps> = memo(
  function ProductDetailEventsImpl({
    productId,
    chain,
    isMobile,
  }: ProductDetailEventsProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [hasRequestedData, setHasRequestedData] = useState(false);
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
      enabled: hasRequestedData,
    });

    const explorerBase = useExplorerBase(chain);
    const thresholds = useBadgeThresholds(productAddress, livePools);
    const gridRef = useRef<AgGridReact<GqlPoolEvent>>(null);

    const rowData = poolEvents;

    const showSpinner = loading && !error && rowData.length === 0;

    const heatmap = useHeatmapData(product, poolEvents);
    const handleCollapseChange = useCallback((activeKey: string | string[]) => {
      const isOpen = Array.isArray(activeKey)
        ? activeKey.includes(EVENTS_PANEL_KEY)
        : activeKey === EVENTS_PANEL_KEY;
      setIsPanelOpen(isOpen);
      if (isOpen) {
        setHasRequestedData(true);
      }
    }, []);

    return (
      <Row id="events" className={styles.eventsRow}>
        <Col span={24}>
          <Collapse
            defaultActiveKey={[]}
            className={styles.eventsCollapse}
            bordered={false}
            onChange={handleCollapseChange}
          >
            <Panel key={EVENTS_PANEL_KEY} header="Events">
              <Row>
                <Col span={24} className={styles.headerCol}>
                  <ProductDetailEventsHeader
                    isMobile={!!isMobile}
                    showTitle={false}
                    onCsv={() => gridRef.current?.api?.exportDataAsCsv()}
                  />
                </Col>
                <Col span={24} className={styles.contentCol}>
                  {!hasRequestedData && isPanelOpen ? (
                    <Spin />
                  ) : showSpinner ? (
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
            </Panel>
          </Collapse>
        </Col>
      </Row>
    );
  }
);
