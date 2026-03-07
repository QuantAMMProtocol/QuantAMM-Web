import {
  LiquidityPool,
  RunTimePeriodRange,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import { SimulationRunBreakdown } from '../simulationResults/simulationResultSummaryModels';

export interface TrainingRunSummary {
  runId: string;
  runLocation: string;
  status: 'Pending' | 'Running' | 'Complete' | 'Failed';
  startedAtIso: string;
  finishedAtIso?: string;
  latestStep?: number;
  totalSteps?: number;
  latestObjective?: number;
  errorMessage?: string;
}

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
  trainingRunStatus: 'Pending' | 'Running' | 'Complete' | 'Failed';
  activeTrainingRunId: string;
  activeTrainingRunLocation: string;
  trainingLatestStep: number;
  trainingTotalSteps: number;
  trainingLatestObjective: number | null;
  trainingLastUpdatedAtIso: string;
  trainingErrorMessage: string;
  trainingRunHistory: TrainingRunSummary[];
}
