import {
  LiquidityPool,
  LiquidityPoolCoin,
  LiquidityPoolDto,
  RunTimePeriodRange,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import { SimulationResultAnalysisDto } from '../simulationRunner/simulationRunnerDtos';

export interface ReturnTimeStep {
  date: string;
  unix: number;
  return: number;
}

export interface VaRTimestep {
  date: string;
  unix: number;
  return: number;
}

export interface ReturnDistribution {
  percentile: number;
  count: number;
}

export interface SimulationRunMetric {
  Rf: string; // this would be dtb3/0 as a string for all of the stub data
  metricName: string;
  metricValue?: number; // daily var
  benchmarkName?: string; // hold, btc,

  metricTimePeriod?: ReturnTimeStep[]; //optional for dates
}

export interface SimulationDrawdownMetric {
  metricName: string;
  metricTimePeriod: ReturnTimeStep[]; //optional for dates
}

export interface SimulationRunLiquidityPoolSnapshot {
  unix: number;
  date: string;
  coinsHeld: LiquidityPoolCoin[];
  feeForSnapshot: number;
  hodlEquiv: SimulationRunLiquidityPoolSnapshot | undefined;
  totalFeesReceivedToDate: number;
  totalPoolMarketValue: number;
}

export interface SimulationRunBreakdown {
  simulationRun: LiquidityPool;
  flatSimulationRunResult: FlatResultSummaryBreakdown | undefined;
  simulationRunStatus: string;
  simulationComplete: boolean;
  timeSteps: SimulationRunLiquidityPoolSnapshot[];
  timeRange: RunTimePeriodRange;
  simulationRunResultAnalysis: SimulationResultAnalysisDto | undefined;
}

export interface SimulationRunBreakdownDto {
  simulationRun: LiquidityPoolDto;
  flatSimulationRunResult: FlatResultSummaryBreakdown | undefined;
  simulationRunStatus: string;
  simulationComplete: boolean;
  timeSteps: SimulationRunLiquidityPoolSnapshot[];
  timeRange: RunTimePeriodRange;
  simulationRunResultAnalysis: SimulationResultAnalysisDto;
}

export interface FlatResultSummaryBreakdown {
  updateRule: string;
  parameters: string;
  timePeriodName: string;
  starDate: string;
  endDate: string;
  initialMarketValue: number;
  finalMarketValue: number;
  totalReturn: number;
  originatingBreakdown: SimulationRunBreakdown;
}
