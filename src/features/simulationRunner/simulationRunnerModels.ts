import {
  LiquidityPool,
  RunTimePeriodRange,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import { SimulationRunBreakdown } from '../simulationResults/simulationResultSummaryModels';

export interface SimulationRunner {
  runTimePeriodRanges: RunTimePeriodRange[];
  simulationsToRun: LiquidityPool[];
  simulationRunBreakdowns: SimulationRunBreakdown[];
  simulationRunStatus: string;
  simulationRunStatusStepIndex: number;
  simulationResultChartSelection: string;
  simulationRunnerTimeRangeSelection: string;
  simulationResultTimeRangeSelection: string;
  simulationResultBreakdownSelection: string;
  simulationRunProgressPercent: number;
  simulationRunnerCurrentStepIndex: number;
  simulationRunnerCurrentRunTypeIndex: number;
}
