import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';

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

export const getAnalysisSummary = (
  simulationRunBreakdowns: SimulationRunBreakdown[]
): FlatQuantDynamicAnalysisBreakdown[] => {
  const results: FlatQuantDynamicAnalysisBreakdown[] = [];

  simulationRunBreakdowns
    .filter(
      (simulationRunBreakdown) =>
        simulationRunBreakdown.simulationRunStatus === 'Complete'
    )
    .forEach((simulationRunBreakdown) => {
      if (simulationRunBreakdown.simulationRunResultAnalysis) {
        simulationRunBreakdown.simulationRunResultAnalysis.return_analysis
          .filter(
            (x) =>
              x.metricValue !== undefined &&
              x.metricValue !== null &&
              !Number.isNaN(x.metricValue)
          )
          .forEach((y) => {
            const breakdown: FlatQuantDynamicAnalysisBreakdown = {
              updateRule:
                simulationRunBreakdown.simulationRun.updateRule.updateRuleName,
              parameters: (
                simulationRunBreakdown.simulationRun.updateRule
                  .updateRuleParameters || []
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
              timePeriodName: simulationRunBreakdown.timeRange.name,
              startDate: simulationRunBreakdown.timeRange.startDate,
              endDate: simulationRunBreakdown.timeRange.endDate,
              benchmark: 'N/A',
              rf: y.Rf,
              metricName: y.metricName,
              metricValue: y.metricValue,
            };

            results.push(breakdown);
          });

        simulationRunBreakdown.simulationRunResultAnalysis?.benchmark_analysis
          .filter(
            (x) =>
              x.metricValue !== undefined &&
              x.metricValue !== null &&
              !Number.isNaN(x.metricValue)
          )
          .forEach((analysis) => {
            if (
              analysis.benchmarkName?.toLowerCase() !==
              simulationRunBreakdown.simulationRun.updateRule.updateRuleName.toLowerCase()
            ) {
              const breakdown: FlatQuantDynamicAnalysisBreakdown = {
                updateRule:
                  simulationRunBreakdown.simulationRun.updateRule
                    .updateRuleName,
                parameters: (
                  simulationRunBreakdown.simulationRun.updateRule
                    .updateRuleParameters || []
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
                timePeriodName: simulationRunBreakdown.timeRange.name,
                startDate: simulationRunBreakdown.timeRange.startDate,
                endDate: simulationRunBreakdown.timeRange.endDate,
                benchmark: analysis.benchmarkName ?? '',
                rf: analysis.Rf,
                metricName: analysis.metricName,
                metricValue: analysis.metricValue,
              };

              results.push(breakdown);
            }
          });
      }
    });

  return results;
};
