import { FC, useMemo, useRef, useState } from 'react';
import { Button, Col, Row, Spin, Typography } from 'antd';
import { ColDef, GridOptions } from 'ag-grid-community';
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
    first: 100,
    skip: 0,
    poolId: product.id,
    chain: product.chain as GqlChain,
    range,
  });

  const [poolEventsColDefs] = useState<ColDef[]>([
    {
      colId: 'timestamp',
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 180,
      valueFormatter: (params) =>
        format(params.value * 1000, 'MM-dd-yy HH:mm:ss'),
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
    },
    { colId: 'type', field: 'type', headerName: 'Type', width: 100 },
    {
      colId: 'valueUSD',
      field: 'valueUSD',
      headerName: 'Value',
      width: 150,
      valueFormatter: (params) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(params.value)),
      cellStyle: { textAlign: 'right' },
    },
    {
      colId: 'sender',
      field: 'sender',
      headerName: 'Sender',
      width: 140,
    },
    {
      colId: 'tx',
      field: 'tx',
      headerName: 'Tx',
      width: 140,
    },
  ]);

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
        <Title level={4}>Events</Title>
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
              style={{ display: 'flex', justifyContent: 'end', padding: 10 }}
            >
              <Button onClick={handleDownloadCSV}>Download CSV</Button>
            </div>
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
              />
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};
