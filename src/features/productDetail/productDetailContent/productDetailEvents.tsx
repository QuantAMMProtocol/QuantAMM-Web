import { FC, useMemo, useRef } from 'react';
import { Button, Col, Row, Spin, Tag, Typography } from 'antd';
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

  const { poolEvents, loading, error } = useFetchPoolEventsData({
    first: undefined,
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
        colId: 'timestamp',
        field: 'timestamp',
        headerName: 'Timestamp',
        width: 180,

        valueFormatter: (params: ValueFormatterParams) => {
          console.log('params', params);
          const { value, node } = params;
          // if it's a group row, or no valid numeric timestamp, just render blank (or return the group key)
          if (node?.group ?? typeof value !== 'number') {
            console.log('value', value);
            console.log('node', node);
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
        colId: 'id',
        field: 'id',
        headerName: 'ID',
        width: 140,
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
    [explorerRootUrl, product.chain]
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
        nonEditableColumn: { editable: false },
      },
      groupDefaultExpanded: 3,
      defaultSortModel: [{ colId: 'timestamp', sort: 'asc' }],
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
            width: '100%',
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
