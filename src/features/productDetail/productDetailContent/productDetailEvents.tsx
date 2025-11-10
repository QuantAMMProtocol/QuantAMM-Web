import { FC, memo, useCallback, useMemo, useRef } from 'react';
import { Button, Col, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import type {
  GridOptions,
  ICellRendererParams,
  SideBarDef,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';
import {
  GqlChain,
  GqlPoolEvent,
} from '../../../__generated__/graphql-types';
import { useFetchPoolEventsData } from '../../../hooks/useFetchPoolEventsData';
import { useAppSelector } from '../../../app/hooks';
import { selectAgGridTheme } from '../../themes/themeSlice';
import {
  selectProductById,
} from '../../productExplorer/productExplorerSlice';

import { CURRENT_LIVE_FACTSHEETS } from '../../documentation/factSheets/liveFactsheets';

const { Title } = Typography;

interface ProductDetailEventsProps {
  productId: string;
  chain: GqlChain;
}

export const ProductDetailEvents: FC<ProductDetailEventsProps> = memo(
  function ProductDetailEventsImpl({
    productId,
    chain,
  }: ProductDetailEventsProps) {
    const darkThemeAg = useAppSelector(selectAgGridTheme);
    const gridRef = useRef<AgGridReact<GqlPoolEvent>>(null);

    // Narrow product selection (for features that require address)
    const product = useAppSelector((s) => selectProductById(s, productId));
    const productAddress = product?.address?.toLowerCase() ?? '';

    const live_pools = CURRENT_LIVE_FACTSHEETS

    // Fetch events (primitive deps only)
    const { poolEvents, loading, error } = useFetchPoolEventsData({
      first: 1000,
      skip: undefined,
      poolId: productId,
      chain: chain,
    });

    // Stable block explorer base by chain
    const explorerBase = useMemo(() => {
      const roots: Record<string, string> = {
        MAINNET: 'https://etherscan.io',
        BASE: 'https://basescan.org',
        ARBITRUM: 'https://arbiscan.io',
        SONIC: 'https://sonicscan.org',
      };
      return roots[String(chain).toUpperCase()] ?? 'https://etherscan.io';
    }, [chain]);

    function truncateMiddle(
      text: string,
      startChars = 6,
      endChars = 6,
      ellipsis = '....'
    ): string {
      if ((text?.length ?? 0) <= startChars + endChars) {
        return text;
      }
      const start = text.slice(0, startChars);
      const end = text.slice(text.length - endChars);
      return `${start}${ellipsis}${end}`;
    }

    const { goldThreshold, silverThreshold, bronzeThreshold, srcPrefix } =
      useMemo(() => {
        let gold = 0;
        let silver = 0;
        let bronze = 0;
        let prefix = 'UNKNOWN';
        const factsheetDepositorBadge = live_pools.factsheets.find(y => y.poolId == productAddress)?.depositorBadges;
        if (productAddress && factsheetDepositorBadge) {
            prefix = factsheetDepositorBadge.prefix;
            gold = factsheetDepositorBadge.gold;
            silver = factsheetDepositorBadge.silver;
            bronze = factsheetDepositorBadge.bronze;
        }
        return {
          goldThreshold: gold,
          silverThreshold: silver,
          bronzeThreshold: bronze,
          srcPrefix: prefix,
        };
      }, [live_pools.factsheets, productAddress]);

    // Column definitions (memoized; closures capture only stable primitives)
    const columnDefs = useMemo(
      () => [
        {
          colId: 'badge',
          headerName: '',
          width: 40,
          suppressMenu: true,
          sortable: false,
          filter: false,
          cellRenderer: (params: { data: any }) => {
            const { data } = params;
            if (!data || data.type !== 'ADD') return null; // only ADD events

            const ts: number = data.timestamp;
            let src: string | null = null;
            let tooltip: string | null = null;

            if (ts < goldThreshold) {
              src = `/products/${srcPrefix}Gold_sm.png`;
              tooltip = 'Gold Badge';
            } else if (ts < silverThreshold) {
              src = `/products/${srcPrefix}Silver_sm.png`;
              tooltip = 'Silver Badge';
            } else if (ts < bronzeThreshold) {
              src = `/products/${srcPrefix}Bronze_sm.png`;
              tooltip = 'Bronze Badge';
            }

            if (!src) return null; // ≥ bronze → no badge

            return (
              <Tooltip title={tooltip} placement="top">
                <img
                  src={src}
                  alt="badge"
                  style={{
                    width: 24,
                    height: 24,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </Tooltip>
            );
          },
        },
        {
          colId: 'timestamp',
          field: 'timestamp',
          headerName: 'Timestamp',
          width: 180,
          valueFormatter: (params: ValueFormatterParams) => {
            const { value, node } = params;
            if (node?.group ?? typeof value !== 'number') return '';
            return format(value * 1000, 'dd-MM-yy HH:mm:ss');
          },
          enableRowGroup: true,
        },
        { colId: 'type', field: 'type', headerName: 'Type', width: 100 },
        {
          colId: 'valueUSD',
          field: 'valueUSD',
          headerName: 'Value',
          width: 110,
          valueFormatter: (p: { value: unknown }) => {
            const v = Number(p.value);
            if (!Number.isFinite(v)) return '';
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(v);
          },
          cellStyle: { textAlign: 'right' as const },
        },
        {
          colId: 'sender',
          field: 'sender',
          headerName: 'Sender',
          width: 160,
          enableRowGroup: true,
          cellRenderer: (params: ICellRendererParams) => {
            const url = `${explorerBase}/address/${params.value}`;
            return (
              <Tag
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: 'center' }}
                >
                  {truncateMiddle(String(params.value))}
                </a>
              </Tag>
            );
          },
        },
        {
          colId: 'tx',
          field: 'tx',
          headerName: 'Tx',
          width: 160,
          enableRowGroup: true,
          cellRenderer: (params: ICellRendererParams) => {
            const url = `${explorerBase}/tx/${params.value}`;
            return (
              <Tag
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: 'center' }}
                >
                  {truncateMiddle(String(params.value))}
                </a>
              </Tag>
            );
          },
        },
        {
          colId: 'blockNumber',
          field: 'blockNumber',
          headerName: 'Block Number',
          width: 150,
          enableRowGroup: true,
          type: 'number',
        },
      ],
      [bronzeThreshold, explorerBase, goldThreshold, silverThreshold, srcPrefix]
    );

    const rowData = useMemo(
      () =>
        (poolEvents ?? []).map(
          ({
            blockNumber,
            id,
            sender,
            timestamp,
            tx,
            type,
            valueUSD,
          }: GqlPoolEvent) => ({
            id,
            blockNumber,
            type,
            sender,
            tx,
            timestamp,
            valueUSD,
          })
        ),
      [poolEvents]
    );

    const gridOptions: GridOptions = useMemo(
      () => ({
        columnDefs,
        rowHeight: 26,
        defaultColDef: {
          filter: 'agTextColumnFilter',
          sortable: true,
          resizable: true,
          enablePivot: true,
        },
        columnTypes: {
          number: { filter: 'agNumberColumnFilter', sortable: true },
          nonEditableColumn: { editable: false },
        },
        groupDefaultExpanded: 3,
      }),
      [columnDefs]
    );

    const sideBar: SideBarDef = useMemo(
      () => ({
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            minWidth: 100,
            maxWidth: 300,
            width: 200,
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            minWidth: 100,
            maxWidth: 300,
            width: 200,
          },
        ],
        position: 'right',
        defaultToolPanel: 'none',
      }),
      []
    );

    const handleDownloadCSV = useCallback(() => {
      gridRef.current?.api?.exportDataAsCsv();
    }, []);

    const showSpinner = loading && !error && rowData.length === 0;

    return (
      <Row id="events" style={{ marginTop: 20 }}>
        <Col
          span={24}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            paddingLeft: 8,
            borderBottom: '1px solid var(--primary-lighter)',
          }}
        >
          <Title
            level={4}
            style={{
              width: '90%',
              marginBottom: 0,
              paddingLeft: 8,
              paddingTop: 8,
            }}
          >
            <Row>
              <Col span={20}>
                <h4>Events</h4>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleDownloadCSV}
                  style={{ marginTop: 20 }}
                >
                  Download CSV
                </Button>
              </Col>
            </Row>
          </Title>
        </Col>

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
          {showSpinner ? (
            <Spin />
          ) : error && rowData.length === 0 ? (
            <div>Failed to load events.</div>
          ) : (
            <div style={{ width: '100%' }}>
              <div
                className={darkThemeAg}
                style={{ height: 700, width: '100%' }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  gridOptions={gridOptions}
                  columnDefs={columnDefs}
                  sideBar={sideBar}
                />
              </div>
            </div>
          )}
        </Col>
      </Row>
    );
  }
);
