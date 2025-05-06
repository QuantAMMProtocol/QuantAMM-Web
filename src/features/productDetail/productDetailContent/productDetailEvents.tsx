import { FC, useMemo, useRef, useState } from 'react';
import { Button, Col, Row, Spin, Typography } from 'antd';
import { ColDef, GridOptions, SideBarDef } from 'ag-grid-community';
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

  const [poolEventsColDefs] = useState<ColDef[]>([
    {
      colId: 'timestamp',
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 180,
      
      valueFormatter: ({ value, node }) => {
        // if it's a group row, or no valid numeric timestamp, just render blank (or return the group key)
        if (!node?.group || typeof(value) !== 'number') {
          return ''
        }
        // otherwise it's a real timestamp
        return format(value * 1000, 'MM-dd-yy HH:mm:ss')
      },
      enableRowGroup: true,
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
      type:'number',
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
      enableRowGroup: true,
      type:'text',
    },
    {
      colId: 'tx',
      field: 'tx',
      headerName: 'Tx',
      width: 140,
      enableRowGroup: true,
      type:'text',
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
                sideBar={sideBar}
              />
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};
