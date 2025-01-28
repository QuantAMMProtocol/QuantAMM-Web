import { SimulationResultAnalysisDto } from '../features/simulationRunner/simulationRunnerDtos';

export interface FinancialAnalysisRequestDto {
  startDateString: string;
  endDateString: string;
  tokens: string[];
  returns: number[][]; //first elem timestamp, then portfolio then benchmarks
  benchmarks: string[];
}

export interface FinancialAnalysisResultDto {
  analysis: SimulationResultAnalysisDto;
}
