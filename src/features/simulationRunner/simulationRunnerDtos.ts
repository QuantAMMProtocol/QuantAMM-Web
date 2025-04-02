import { SimulationRunMetric } from '../simulationResults/simulationResultSummaryModels';
import {
  FeeHook,
  GasStep,
  LiquidityPool,
  LiquidityPoolCoin,
  SwapImport,
  UpdateRule,
  UpdateRuleParameter,
} from '../simulationRunConfiguration/simulationRunConfigModels';

export interface SimulationRunDto {
  pool: LiquidityPoolDto;
  feeHooks: FeeHook[];
  swapImports: SwapImport[];
  gasPriceImports: GasStep[];
  startUnix: number;
  endUnix: number;
  startDateString: string;
  endDateString: string;
}

export interface TrainingDto {
  trainingRunFilename: string;
  trainingParameters: TrainingParametersDto;
  pool: LiquidityPoolDto;
  startUnix: number;
  endUnix: number;
}

export interface TrainingResultDto {
  step: number;
  objective: number[];
  train_objective: number[];
  test_objective: number[];
  parameter_values: TrainingParameterValueDto[];
}

export interface TrainingParameterValueDto {
  name: string;
  value: number[][];
}

export interface TrainingParametersDto {
  trainingParameters: TrainingParameterDto[];
}

export interface TrainingParameterDto {
  name: string;
  value: string;
  description: string;
  minValue: string;
  maxValue: string;
}

export interface LiquidityPoolDto {
  id: string;
  poolConstituents: LiquidityPoolCoinDto[];
  updateRule: UpdateRuleDto;
  poolNumeraireCoinCode: string;
  enableAutomaticArbBots: boolean;
}
export interface UpdateRuleDto {
  name: string;
  UpdateRuleParameters: UpdateRuleFactorDto[];
}

export interface UpdateRuleFactorDto {
  name: string;
  value: string[];
}

export interface LiquidityPoolCoinDto {
  coinName: string;
  coinCode: string;
  marketValue: number | undefined;
  currentPrice: number | undefined;
  amount: number | undefined;
  weight: number | undefined;
}

export interface SimulationResult {
  timeSteps: SimulationResultTimestepDto[];
  analysis: SimulationResultAnalysisDto;
}

export interface SimulationResultAnalysisDto {
  return_analysis: SimulationRunMetric[];
  benchmark_analysis: SimulationRunMetric[];
  return_timeseries_analysis: SimulationResultTimeseries[];
}

export interface SimulationResultTimeseries {
  timeSteps: SimulationResultTimestepDto[];
  Rf: string;
  metricName: string;
  metricKey: string; // TODO: should come from the backend
  benchmarkName: string;
}

export interface SimulationResultTimestepDto {
  unix: number;
  coinsHeld: LiquidityPoolCoinDto[];
  timeStepTotal: number;
}

export function ConvertToLiquidityPoolDto(
  pool: LiquidityPool
): LiquidityPoolDto {
  return {
    id: pool.id,
    poolConstituents: pool.poolConstituents.map((x) =>
      ConvertToLiquidityPoolCoinDto(x)
    ),
    updateRule: ConvertToUpdateRuleDto(pool.updateRule),
    poolNumeraireCoinCode: pool.poolNumeraireCoinCode,
    enableAutomaticArbBots: pool.enableAutomaticArbBots,
  };
}

export function ConvertToLiquidityPoolCoinDto(
  coin: LiquidityPoolCoin
): LiquidityPoolCoinDto {
  return {
    coinName: coin.coin.coinName,
    coinCode: coin.coin.coinCode,
    marketValue: coin.marketValue,
    currentPrice: coin.currentPrice,
    amount: coin.amount,
    weight: coin.weight,
  };
}

export function ConvertToUpdateRuleDto(rule: UpdateRule): UpdateRuleDto {
  const convertedFactors: UpdateRuleFactorDto[] = [];

  rule.updateRuleParameters.forEach((x) => {
    if (x.applicableCoins.length > 0) {
      const sortedArray = [...x.applicableCoins].sort((a, b) =>
        a.coin.coinCode.localeCompare(b.coin.coinCode)
      );
      const perTokenFactors: string[] = [];
      for (const item of sortedArray) {
        perTokenFactors.push(item.factorValue ?? 'error');
      }

      convertedFactors.push(
        ConvertToUpdateRuleVectorFactorDto(x.factorName, perTokenFactors)
      );
    } else {
      convertedFactors.push(ConvertToUpdateRuleFactorDto(x));
    }
  });

  convertedFactors.push({
    name: 'chunk_period',
    value: ['1440'],
  });

  convertedFactors.push({
    name: 'weight_interpolation_period',
    value: ['1440'],
  });

  return {
    name: rule.updateRuleSimKey,
    UpdateRuleParameters: convertedFactors,
  };
}

export function ConvertToUpdateRuleFactorDto(
  factor: UpdateRuleParameter
): UpdateRuleFactorDto {
  return {
    name: factor.factorName,
    value: [factor.factorValue],
  };
}

export function ConvertToUpdateRuleVectorFactorDto(
  parameterName: string,
  factorValue: string[]
): UpdateRuleFactorDto {
  return {
    name: parameterName,
    value: factorValue,
  };
}
