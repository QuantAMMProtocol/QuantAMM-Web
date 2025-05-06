import { FC, useCallback, useMemo, useRef } from 'react';
import { ColDef, SideBarDef, CellStyle } from 'ag-grid-community';
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
import { benchmarkMetricThresholds, returnMetricThresholds } from '../../../models';

interface AnalysisBreakdownTableProps {
  simulationRunBreakdowns: SimulationRunBreakdown[];
  visibleMetrics: string[];
  height?: number;
}

export const AnalysisSimplifiedBreakdownTable: FC<
  AnalysisBreakdownTableProps
> = ({ simulationRunBreakdowns, visibleMetrics, height = 700 }) => {
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const gridRef = useRef<AgGridReact>(null);

  const flatSummary = useMemo(() => {
    interface Flat {
      updateRule: string;
      metric: string;
      value: number;
    }
    const out: Flat[] = [];
    simulationRunBreakdowns.forEach((br) => {
      const ruleName = br.simulationRun.updateRule.updateRuleName;
      const analysis = br.simulationRunResultAnalysis;
      if (!analysis) return;
      const metrics: SimulationRunMetric[] = [
        ...(analysis.return_analysis || []),
        ...(analysis.benchmark_analysis || []),
      ];
      metrics.forEach((m) => {
        if (m.benchmarkName === 'benchmark_return_analysis') return;
        if (m.metricValue == null) return;
        out.push({
          updateRule: ruleName,
          metric: m.metricName,
          value: m.metricValue,
        });
      });
    });
    return out;
  }, [simulationRunBreakdowns]);

  const updateRules = useMemo(
    () => Array.from(new Set(flatSummary.map((f) => f.updateRule))),
    [flatSummary]
  );

  const getColorFor = useCallback((metric: string, value: number | null) => {
    if (value == null) return undefined;
    const t = [...returnMetricThresholds, ...benchmarkMetricThresholds].find(x => x.key === metric);
    if (!t) return undefined;

    const { veryLow, low, medium, high } = t;
    const ascending = high > medium;
    if (ascending) {
      if (value >= high)   return t.highColor;
      if (value >= medium) return t.mediumColor;
      if (value >= low)    return t.lowColor;
      if (value >= veryLow)return t.veryLowColor;
      return '#610000'
    } else {
      if (value <= high)   return t.highColor;
      if (value <= medium) return t.mediumColor;
      if (value <= low)    return t.lowColor;
      if (value <= veryLow)return t.veryLowColor;
      return '#01ec38'
    }
    return undefined;
  }, []);

  const colDefs = useMemo<ColDef[]>(
    () => [
      {
        colId: 'metric',
        field: 'metric',
        headerName: 'Metric',
        pinned: 'left',
        sortable: true,
        filter: 'agSetColumnFilter',
        resizable: true,
        width: 300,
        tooltipValueGetter: params => {
        const t = returnMetricThresholds.find(x => x.key === params.value);
        return t?.tooltipDescription;
      },
      },
      ...updateRules.map(rule => ({
        colId: rule,
        field: rule,
        headerName: rule,
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true,
        valueFormatter: (params: { value: number | undefined}) =>
          typeof params.value === 'number'
            ? params.value.toFixed(4)
            : '',
        cellStyle: (params: { data: { metric: string; }; value: number | null; }): CellStyle | undefined => {
          const metric = params.data.metric;
          const color = getColorFor(metric, params.value);
          if (!color) return undefined;
          return { backgroundColor: color };
        },
      })),
    ],
    [updateRules, getColorFor]
  );

  // 4) build your rows
  const rowData = useMemo(() => {
    const metrics = Array.from(new Set(flatSummary.map((f) => f.metric)));
    return metrics.map((metric) => {
      const row: Record<string, string | number | null> = { metric };
      updateRules.forEach((rule) => {
        const e = flatSummary.find(
          (f) => f.metric === metric && f.updateRule === rule
        );
        row[rule] = e ? e.value : null;
      });
      return row;
    });
  }, [flatSummary, updateRules]);

  const sideBar: SideBarDef = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns', // ← add this
        iconKey: 'columns', // ← add this
        toolPanel: 'agColumnsToolPanel',
        minWidth: 100,
        maxWidth: 300,
        width: 200,
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters', // ← add this
        iconKey: 'filter', // ← add this
        toolPanel: 'agFiltersToolPanel',
        minWidth: 100,
        maxWidth: 300,
        width: 200,
      },
    ],
    position: 'right',
    defaultToolPanel: 'none',
  };

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
          // make it explicit if you like:
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
          /* …other props… */
          tooltipShowDelay={200}       // optional: delay before showing
          tooltipMouseTrack={true}     // optional: have it follow your cursor
        />
      </div>
    </div>
  );
};
