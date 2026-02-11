import { SimulationResultAnalysisDto } from '../features/simulationRunner/simulationRunnerDtos';
import type { Benchmark } from './benchmark';

export type FinancialAnalysisReturnEntry = [number, number, number];

export interface FinancialAnalysisRequestDto {
  startDateString: string;
  endDateString: string;
  tokens: string[];
  returns: FinancialAnalysisReturnEntry[];
  benchmarks: Benchmark[];
}

export interface FinancialAnalysisResultDto {
  analysis: SimulationResultAnalysisDto;
}
