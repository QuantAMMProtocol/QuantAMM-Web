import { FC, useCallback, useMemo, useRef } from 'react';
import {
  ColDef,
  SideBarDef,
  CellStyle,
  ValueGetterParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { useAppSelector } from '../../../app/hooks';
import { selectAgGridTheme } from '../../themes/themeSlice';
import {
  SimulationRunBreakdown,
  SimulationRunMetric,
} from '../../simulationResults/simulationResultSummaryModels';
import {
  benchmarkMetricThresholds,
  returnMetricThresholds,
} from '../../../models';

interface AnalysisBreakdownTableProps {
  simulationRunBreakdowns: SimulationRunBreakdown[];
  benchmarkBreakdown: SimulationRunBreakdown | null;
  visibleMetrics: string[];
  height?: number;
}

//TODO CH split components.
export const AnalysisSimplifiedBreakdownTable: FC<
  AnalysisBreakdownTableProps
> = ({
  simulationRunBreakdowns,
  benchmarkBreakdown,
  visibleMetrics,
  height = 700,
}) => {
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const gridRef = useRef<AgGridReact>(null);

  const benchmarkHeaderName = useMemo(() => {
    if (!benchmarkBreakdown) {
      return null;
    }
    return benchmarkBreakdown.simulationRun.updateRule.updateRuleName;
  }, [benchmarkBreakdown]);

  const allBreakdowns = useMemo(() => {
    return benchmarkBreakdown
      ? [...simulationRunBreakdowns, benchmarkBreakdown]
      : simulationRunBreakdowns;
  }, [simulationRunBreakdowns, benchmarkBreakdown]);

  const flatSummary = useMemo(() => {
    interface Flat {
      updateRule: string;
      metric: string;
      benchmark: string;
      value: number;
    }
    const out: Flat[] = [];
    allBreakdowns.forEach((br) => {
      const ruleName = br.simulationRun.updateRule.updateRuleName;
      const analysis = br.simulationRunResultAnalysis;
      if (!analysis) {
        return;
      }

      const metrics: SimulationRunMetric[] = [
        ...(analysis.return_analysis || []),
        ...(analysis.benchmark_analysis || []),
      ];
      metrics
        .filter(
          (x) =>
            x.benchmarkName !== 'benchmark_return_analysis' &&
            x.metricValue !== undefined &&
            x.metricValue !== null &&
            Number.isFinite(x.metricValue)
        )
        .forEach((m) => {
          out.push({
            updateRule: ruleName,
            metric: m.metricName,
            benchmark: m.benchmarkName ?? '',
            value: m.metricValue!,
          });
        });
    });
    return out;
  }, [allBreakdowns]);

  const updateRules = useMemo(
    () => Array.from(new Set(flatSummary.map((f) => f.updateRule))),
    [flatSummary]
  );

  const getColorFor = useCallback((metric: string, value: number | null) => {
    if (value == null) return undefined;

    const t = [...returnMetricThresholds, ...benchmarkMetricThresholds].find(
      (x) => x.key === metric
    );
    if (!t) return undefined;

    const { veryLow, low, medium, high } = t;
    const ascending = high > medium;

    if (ascending) {
      if (value >= high) return t.highColor;
      if (value >= medium) return t.mediumColor;
      if (value >= low) return t.lowColor;
      if (value >= veryLow) return t.veryLowColor;
      return '#610000';
    }

    if (value <= high) return t.highColor;
    if (value <= medium) return t.mediumColor;
    if (value <= low) return t.lowColor;
    if (value <= veryLow) return t.veryLowColor;
    return '#01ec38';
  }, []);

  const vsCellStyle = useCallback(
    (value: number | null): CellStyle | undefined => {
      if (value == null) return undefined;

      // Light green if > 0, dark green if > 100%, red if < 0
      if (value > 0)
        return { backgroundColor: 'rgba(2, 189, 46, 0.6)', color: '#ffffff' };
      if (value < 0) return { backgroundColor: 'rgba(166, 0, 0, 0.6)' };
      return undefined;
    },
    []
  );

  const colDefs = useMemo<ColDef[]>(() => {
    let baseCols: ColDef[] = [
      {
        colId: 'metric',
        field: 'metric',
        headerName: 'Metric',
        pinned: 'left',
        sortable: true,
        filter: 'agSetColumnFilter',
        resizable: true,
        width: 300,
        tooltipValueGetter: (params) => {
          const t = returnMetricThresholds.find((x) => x.key === params.value);
          return t?.tooltipDescription;
        },
      },
    ];

    baseCols = [
      ...baseCols,
      {
        colId: 'benchmark',
        field: 'benchmark',
        headerName: 'Benchmark',
        sortable: true,
        filter: 'agSetColumnFilter',
        resizable: true,
        width: 320,
      },
    ];

    baseCols = [
      ...baseCols,
      ...updateRules.map((rule) => ({
        colId: rule,
        field: rule,
        headerName: rule,
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true,
        valueFormatter: (params: { value: number | undefined }) =>
          typeof params.value === 'number' ? params.value.toFixed(4) : '',
        cellStyle: (params: {
          data: { metric: string };
          value: number | null;
        }): CellStyle | undefined => {
          const metric = params.data.metric;
          const color = getColorFor(metric, params.value);
          if (!color) return undefined;
          return { backgroundColor: color };
        },
      })),
    ];

    if (!benchmarkHeaderName) return baseCols;

    const vsCols: ColDef[] = updateRules
      .filter((rule) => rule !== benchmarkHeaderName)
      .map((rule) => {
        const colId = `${rule}__vs__${benchmarkHeaderName}`;
        return {
          colId,
          headerName: `${rule} vs ${benchmarkHeaderName}`,
          sortable: true,
          filter: 'agNumberColumnFilter',
          resizable: true,
          width: 300,
          valueGetter: (params: ValueGetterParams) => {
            const row = params.data as Record<string, unknown> | undefined;
            if (!row) return null;

            const a = row[rule];
            const b = row[benchmarkHeaderName];

            if (typeof a !== 'number' || typeof b !== 'number') return null;
            if (b === 0) return null;

            return a - b;
          },
          valueFormatter: (params: { value: number | null | undefined }) =>
            typeof params.value === 'number'
              ? params.value > 0
                ? `+${params.value.toFixed(2)}`
                : `${params.value.toFixed(2)}`
              : '',
          cellStyle: (params: {
            value: number | null;
          }): CellStyle | undefined => vsCellStyle(params.value),
        } as ColDef;
      });
    return [...baseCols, ...vsCols];
  }, [updateRules, benchmarkHeaderName, getColorFor, vsCellStyle]);

  const rowData = useMemo(() => {
    // Build rows keyed by (metric, benchmark) so each flatSummary entry maps to exactly one cell.
    const rowsByKey = new Map<string, Record<string, string | number | null>>();

    const visibleSet = new Set(visibleMetrics);

    flatSummary
      .filter((f) => visibleSet.has(f.metric))
      .forEach((f) => {
        const benchmark = (f.benchmark ?? '').toUpperCase();
        const key = `${f.metric}||${benchmark}`;

        let row = rowsByKey.get(key);
        if (!row) {
          row = { metric: f.metric, benchmark };
          updateRules.forEach((rule) => {
            row![rule] = null;
          });
          rowsByKey.set(key, row);
        }

        row[f.updateRule] = f.value;
      });

    return Array.from(rowsByKey.values());
  }, [flatSummary, updateRules, visibleMetrics]);

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

  const onGridReady = useCallback(
    (params: { api: any; columnApi: any }) => {
      params.api.setFilterModel({
        metric: { values: visibleMetrics },
      });
    },
    [visibleMetrics]
  );

  const onFirstDataRendered = useCallback(
    (params: { api: any; columnApi: any }) => {
      params.api.setFilterModel({
        metric: {
          filterType: 'set',
          values: visibleMetrics,
        },
      });
      params.api.onFilterChanged();
    },
    [visibleMetrics]
  );

  return (
    <div style={{ width: '100%' }}>
      <div
        className={`${darkThemeAg} ag-theme-quartz`}
        style={{ width: '100%', height }}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          rowData={rowData}
          defaultColDef={{ resizable: true }}
          rowHeight={28}
          rowSelection="single"
          sideBar={sideBar}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          tooltipShowDelay={200}
          tooltipMouseTrack={true}
        />
      </div>
    </div>
  );
};
