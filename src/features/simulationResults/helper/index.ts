import { SideBarDef } from 'ag-grid-community';
import styles from '../simulationResultSummary.module.css';
import { SimulationRunBreakdown } from '../simulationResultSummaryModels';

interface FlatQuantDynamicAnalysisBreakdown {
  updateRule: string;
  parameters: string;
  timePeriodName: string;
  startDate: string;
  endDate: string;
  benchmark: string;
  rf: string;
  metricName: string;
  metricValue?: number;
}

export const defaultColorConfig: Record<string, (value: number) => string> = {
  sharpeRatio: (value: number) => {
    switch (true) {
      case value >= 3:
        return styles.reallyGoodAnalysisResult;
      case value >= 2:
        return styles.reallyGoodAnalysisResult;
      case value >= 1:
        return styles.quiteGoodAnalysisResult;
      case value > 0:
        return styles.borderlineGoodAnalysisResult;
      case value === 0:
        return styles.transparentAnalysisResult;
      case value > -1:
        return styles.borderlineBadAnalysisResult;
      case value > -2:
        return styles.badAnalysisResult;
      case value > -3:
        return styles.quiteBadAnalysisResult;
      default:
        return styles.reallyBadAnalysisResult;
    }
  },
  sortinoRatio: (value: number) => {
    switch (true) {
      case value >= 2.5:
        return styles.reallyGoodAnalysisResult;
      case value >= 2:
        return styles.reallyGoodAnalysisResult;
      case value >= 1.5:
        return styles.quiteGoodAnalysisResult;
      case value > 1:
        return styles.borderlineGoodAnalysisResult;
      case value === 0:
        return styles.transparentAnalysisResult;
      case value > 0:
        return styles.borderlineBadAnalysisResult;
      case value > -1:
        return styles.badAnalysisResult;
      case value > -1.5:
        return styles.quiteBadAnalysisResult;
      default:
        return styles.reallyBadAnalysisResult;
    }
  },
  // @CH Can add more configurations as needed
};

export const getAnalysisSummary = (
  simulationRunBreakdowns: SimulationRunBreakdown[]
): FlatQuantDynamicAnalysisBreakdown[] => {
  const results: FlatQuantDynamicAnalysisBreakdown[] = [];
  simulationRunBreakdowns
    .filter((x) => x.simulationRunStatus === 'Complete')
    .forEach((x) => {
      if (x.simulationRunResultAnalysis) {
        x.simulationRunResultAnalysis.return_analysis
          .filter(
            (y) =>
              y.metricValue !== undefined &&
              y.metricValue !== null &&
              Number.isFinite(y.metricValue)
          )
          .forEach((y) => {
            const breakdown: FlatQuantDynamicAnalysisBreakdown = {
              updateRule: x.simulationRun.updateRule.updateRuleName,
              parameters: (
                x.simulationRun.updateRule.updateRuleParameters || []
              ).reduce<string>((accumulator, current) => {
                return (
                  accumulator +
                  '[' +
                  current.factorName +
                  ':' +
                  current.factorValue +
                  '] '
                );
              }, ''),
              timePeriodName: x.timeRange.name,
              startDate: x.timeRange.startDate,
              endDate: x.timeRange.endDate,
              benchmark: 'N/A',
              rf: y.Rf,
              metricName: y.metricName,
              metricValue: y.metricValue,
            };

            results.push(breakdown);
          });

        x.simulationRunResultAnalysis?.benchmark_analysis
          .filter(
            (z) =>
              z.metricValue !== undefined &&
              z.metricValue !== null &&
              Number.isFinite(z.metricValue)
          )
          .forEach((z) => {
            if (
              z.benchmarkName?.toLowerCase() !==
              x.simulationRun.updateRule.updateRuleName.toLowerCase()
            ) {
              const breakdown: FlatQuantDynamicAnalysisBreakdown = {
                updateRule: x.simulationRun.updateRule.updateRuleName,
                parameters: (
                  x.simulationRun.updateRule.updateRuleParameters || []
                ).reduce<string>((accumulator, current) => {
                  return (
                    accumulator +
                    '[' +
                    current.factorName +
                    ':' +
                    current.factorValue +
                    '] '
                  );
                }, ''),
                timePeriodName: x.timeRange.name,
                startDate: x.timeRange.startDate,
                endDate: x.timeRange.endDate,
                benchmark: z.benchmarkName ?? '',
                rf: z.Rf,
                metricName: z.metricName,
                metricValue: z.metricValue,
              };

              results.push(breakdown);
            }
          });
      }
    });

  return results;
};

export const sideBar: SideBarDef = {
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
