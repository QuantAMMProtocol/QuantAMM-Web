import { FC, useMemo, useRef } from 'react';
import { Button, Col, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import {
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
  GqlPoolEventsDataRange,
} from '../../../__generated__/graphql-types';
import { useFetchPoolEventsData } from '../../../hooks/useFetchPoolEventsData';
import { useAppSelector } from '../../../app/hooks';
import { Product } from '../../../models';
import { selectAgGridTheme } from '../../themes/themeSlice';
import { selectQuantammSetPools } from '../../productExplorer/productExplorerSlice';
import { ROUTES } from '../../../routesEnum';

const { Title } = Typography;

interface ProductDetailEventsProps {
  product: Product;
}

const range = GqlPoolEventsDataRange.NinetyDays;

export const ProductDetailEvents: FC<ProductDetailEventsProps> = ({
  product,
}) => {
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const gridRef = useRef<AgGridReact>(null);
  const quantAMMSetPools = useAppSelector(selectQuantammSetPools);

  let goldThreshold = 0;
  let silverThreshold = 0;
  let bronzeThreshold = 0;
  let srcPrefix = 'UNKNOWN';
  if (
    quantAMMSetPools[product.address]
  ) {
    if(product.address == ROUTES.SAFEHAVENFACTSHEET.toLowerCase()){
      srcPrefix = 'Safe_Haven_'
      goldThreshold = 1748213999;
      silverThreshold = 1749423599;
      bronzeThreshold = 1750633199;
    }
    else if(product.address == ROUTES.BASEMACROFACTSHEET.toLowerCase()){
      srcPrefix = 'Base_Macro_'
      goldThreshold = 1749423599;
      silverThreshold = 1750633199;
      bronzeThreshold = 1751756400;
    }
    else if(product.address == ROUTES.SONICMACROFACTSHEET.toLowerCase()){
      srcPrefix = 'Sonic_Macro_'
      goldThreshold = 1754434800;
      silverThreshold = 1755644400;
      bronzeThreshold = 1756854000;
    }
  }

  const { poolEvents, loading, error } = useFetchPoolEventsData({
    first: 1000,
    skip: undefined,
    poolId: product.id,
    chain: product.chain as GqlChain,
    range,
  });

  const explorerRootUrl: Record<string, string> = useMemo(
    () => ({
      MAINNET: 'https://etherscan.io',
      BASE: 'https://basescan.org',
      ARBITRUM: 'https://arbiscan.io',
      SONIC:'https://sonicscan.org',
    }),
    []
  );

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

  const poolEventsColDefs = useMemo(
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
          // only for ADD events
          if (!data || data.type !== 'ADD') return null;

          const ts = data.timestamp as number;
          let src: string | null = null;
          let tooltip: string | null = null;

          if (ts < (goldThreshold ?? 0)) {
            src = '/products/'+ srcPrefix +'Gold_sm.png';
            tooltip = 'Gold Badge';
          } else if (ts < (silverThreshold ?? 0)) {
            src = '/products/'+ srcPrefix +'Silver_sm.png';
            tooltip = 'Silver Badge';
          } else if (ts < (bronzeThreshold ?? 0)) {
            src = '/products/'+ srcPrefix +'Bronze_sm.png';
            tooltip = 'Bronze Badge';
          }

          if (!src) {
            // timestamp ≥ bronze threshold → no badge
            return null;
          }

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
          // if it's a group row, or no valid numeric timestamp, just render blank (or return the group key)
          if (node?.group ?? typeof value !== 'number') {
            return '';
          }
          // otherwise it's a real timestamp
          return format(value * 1000, 'dd-MM-yy HH:mm:ss');
        },
        enableRowGroup: true,
      },
      { colId: 'type', field: 'type', headerName: 'Type', width: 100 },
      {
        colId: 'valueUSD',
        field: 'valueUSD',
        headerName: 'Value',
        width: 100,
        valueFormatter: (params: { value: any }) => {
          if (
            params.value === null ||
            params.value === undefined ||
            isNaN(params.value)
          ) {
            return '';
          }

          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(params.value));
        },
        cellStyle: { textAlign: 'right' },
      },
      {
        colId: 'sender',
        field: 'sender',
        headerName: 'Sender',
        width: 140,
        enableRowGroup: true,
        cellRenderer: (params: ICellRendererParams) => {
          const base = explorerRootUrl[product.chain];
          const url = `${base}/address/${params.value}`;
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
                {truncateMiddle(params.value)}
              </a>
            </Tag>
          );
        },
      },
      {
        colId: 'tx',
        field: 'tx',
        headerName: 'Tx',
        width: 140,
        enableRowGroup: true,
        // also link to the tx page
        cellRenderer: (params: ICellRendererParams) => {
          const base = explorerRootUrl[product.chain];
          const url = `${base}/tx/${params.value}`;
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
                style={{
                  textAlign: 'center',
                }}
              >
                {truncateMiddle(params.value)}
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
    [bronzeThreshold, explorerRootUrl, goldThreshold, product.chain, silverThreshold, srcPrefix]
  );

  const rowData = poolEvents?.map(
    ({
      blockNumber,
      id,
      sender,
      timestamp,
      tx,
      type,
      valueUSD,
    }: GqlPoolEvent) => ({
      timestamp,
      id,
      blockNumber,
      type,
      sender,
      tx,
      valueUSD,
    })
  );

  const poolEventsGridOptions: GridOptions = useMemo(
    () => ({
      columnDefs: poolEventsColDefs,
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
    [poolEventsColDefs]
  );

  const sideBar: SideBarDef = {
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
  };

  const handleDownloadCSV = () => {
    gridRef.current?.api?.exportDataAsCsv();
  };

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
          marginTop: '20px',
          paddingLeft: 12,
        }}
      >
        
        {loading && !error ? (
          <Spin />
        ) : (
          <div style={{ width: '100%' }}>
            <div
              id="events"
              className={darkThemeAg}
              style={{ height: 700, width: '100%' }}
            >
              <AgGridReact
                rowData={rowData}
                gridOptions={poolEventsGridOptions}
                columnDefs={poolEventsColDefs}
                ref={gridRef}
                sideBar={sideBar}
              />
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};
