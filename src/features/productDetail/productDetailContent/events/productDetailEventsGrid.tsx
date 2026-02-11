import { forwardRef, useMemo } from 'react';
import type { GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { GqlPoolEvent, GqlPoolEventType } from '../../../../__generated__/graphql-types';
import { format } from 'date-fns';
import { Tag, Tooltip } from 'antd';
import { truncateMiddle } from '../utils';
import styles from './productDetailEventsGrid.module.scss';

export interface Thresholds {
  goldThreshold: number;
  silverThreshold: number;
  bronzeThreshold: number;
  srcPrefix: string;
}

interface EventsGridProps {
  rowData: {
    id: string;
    blockNumber?: string | number | null;
    type?: GqlPoolEventType | null;
    sender?: string | null;
    tx?: string | null;
    timestamp?: string | number | null;
    valueUSD?: string | number | null;
  }[];
  explorerBase: string;
  thresholds: Thresholds;
}

export const ProductDetailEventsGrid = forwardRef<AgGridReact<GqlPoolEvent>, EventsGridProps>(function EventsGrid(
  { rowData, explorerBase, thresholds },
  ref
) {
  const columnDefs = useMemo(
    () => [
      {
        colId: 'badge',
        headerName: '',
        width: 40,
        suppressMenu: true,
        sortable: false,
        filter: false,
        cellRenderer: (p: ICellRendererParams) => {
          const val = Number(p.data?.valueUSD ?? 0);

          let level: 'gold' | 'silver' | 'bronze' | null = null;
          if (Number.isFinite(val)) {
            if (val >= thresholds.goldThreshold) level = 'gold';
            else if (val >= thresholds.silverThreshold) level = 'silver';
            else if (val >= thresholds.bronzeThreshold) level = 'bronze';
          }

          const hasValidPrefix = !!thresholds.srcPrefix && thresholds.srcPrefix !== 'UNKNOWN';

          if (!level || !hasValidPrefix) {
            return <span className={styles.badgePlaceholder} />;
          }

          const src = `/badges/${thresholds.srcPrefix}-${level}.svg`;

          return (
            <Tooltip title={`USD Value: $${val.toLocaleString('en-US')}`}>
              <img
                alt=""
                src={src}
                className={styles.badgeImage}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Tooltip>
          );
        },
      },
      {
        colId: 'type',
        field: 'type',
        headerName: 'Type',
        width: 120,
        enableRowGroup: true,
      },
      {
        colId: 'timestamp',
        field: 'timestamp',
        headerName: 'Timestamp',
        width: 165,
        enableRowGroup: true,
        valueFormatter: (p: ValueFormatterParams) =>
          p.value ? format(new Date(Number(p.value) * 1000), 'yyyy-MM-dd HH:mm:ss') : '',
      },
      {
        colId: 'valueUSD',
        field: 'valueUSD',
        headerName: 'Value (USD)',
        width: 150,
        enableRowGroup: true,
        type: 'number',
        valueFormatter: (p: ValueFormatterParams) =>
          p.value
            ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(p.value))
            : '',
        cellStyle: { textAlign: 'right' as const },
      },
      {
        colId: 'sender',
        field: 'sender',
        headerName: 'Sender',
        width: 160,
        enableRowGroup: true,
        cellRenderer: (p: ICellRendererParams) => {
          const url = `${explorerBase}/address/${p.value}`;
          return (
            <Tag className={styles.addressTag}>
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.tagLink}>
                {truncateMiddle(String(p.value))}
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
        cellRenderer: (p: ICellRendererParams) => {
          const url = `${explorerBase}/tx/${p.value}`;
          return (
            <Tag className={styles.addressTag}>
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.tagLink}>
                {truncateMiddle(String(p.value))}
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
    [
      explorerBase,
      thresholds.bronzeThreshold,
      thresholds.goldThreshold,
      thresholds.silverThreshold,
      thresholds.srcPrefix,
    ]
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

  return (
    <AgGridReact
      ref={ref as any}
      rowData={rowData}
      gridOptions={gridOptions}
      columnDefs={columnDefs}
      sideBar={{
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
      }}
    />
  );
});
