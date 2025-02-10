import { ReturnTimeStep } from '../simulationResults/simulationResultSummaryModels';
import { TrainingParametersDto } from '../simulationRunner/simulationRunnerDtos';

export interface CoinPrice {
  unix: number;
  open: number;
  high: number;
  low: number;
  close: number;
  date: string;
}

export interface CoinComparison {
  covariance: number;
  trackingError: number;
}

export interface Coin {
  coinName: string;
  coinCode: string;
  dailyPriceHistory: CoinPrice[];
  dailyPriceHistoryMap: Map<number, CoinPrice>;
  dailyReturns: Map<number, ReturnTimeStep>;
  coinComparisons: Map<string, CoinComparison>;
}

export interface CoinDto {
  coinName: string;
  coinCode: string;
  dailyPriceHistory: CoinPrice[];
}

export interface LiquidityPoolCoin {
  coin: Coin;
  amount: number;
  marketValue: number;
  currentPrice: number;
  currentPriceUnix: number;
  weight: number;
  factorValue: string | null;
}

export interface LiquidityPoolCoinDto {
  coin: CoinDto;
  amount: number;
  marketValue: number;
  currentPrice: number;
  currentPriceUnix: number;
  weight: number;
}

export interface UpdateRuleParameter {
  factorName: string;
  factorDisplayName: string;
  factorDescription: string;
  applicableCoins: LiquidityPoolCoin[]; //empty means all
  factorValue: string;
  minValue: string;
  maxValue: string;
}

export interface UpdateRule {
  updateRuleName: string;
  updateRuleKey: string;
  updateRuleSimKey: string;
  updateRuleResultProfileSummary: string;
  heatmapKeys: HeatMap[];
  updateRuleRunUrl: string | undefined;
  updateRuleTrainUrl: string | undefined;
  applicablePoolTypes: string[];
  updateRuleParameters: UpdateRuleParameter[];
}

export interface HookTimeSeriesStep {
  unix: number;
  value: number;
}
export interface Hook {
  hookName: string;
  hookKey: string;
  hookApplicablePoolTypes: string[] | undefined;
  hookParameters: UpdateRuleParameter[];
  hookTimeSeries: HookTimeSeriesStep[];
}

export interface HeatMap {
  name: string;
  poolName: string;
  imageName: string;
}

export interface LiquidityPool {
  id: string;
  name: string;
  poolConstituents: LiquidityPoolCoin[];
  feeHooks: FeeHook[];
  swapImports: SwapImport[];
  poolType: PoolType;
  updateRule: UpdateRule;
  runStatus: string;
  poolNumeraireCoinCode: string;
  enableAutomaticArbBots: boolean;
}

export interface FeeHookStep {
  unix: number;
  value: number;
}

//could use feehookstep but duplicated to keep naming consistant with func
export interface GasStep {
  unix: number;
  value: number;
}

export interface FeeHook {
  hookName: string;
  hookTargetTokens: string[];
  hookTimeSteps: FeeHookStep[] | undefined;
  minValue: number;
  maxValue: number;
  unit: string;
}

export interface SwapImport {
  unix: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
}

export interface PoolType {
  name: string;
  mandatoryProperties: string[];
  shortDescription: string;
  requiresPoolNumeraire: boolean;
}

export interface LiquidityPoolDto {
  id: string;
  name: string;
  poolConstituents: LiquidityPoolCoinDto[];
  updateRule: UpdateRule;
  runStatus: string;
  enableAutomaticArbBots: boolean;
  poolNumeraireCoinCode: string;
  feeHooks: FeeHook[];
  swapImports: SwapImport[];
  gasSteps: GasStep[];
  poolType: PoolType;
}

export interface SimulationRunDateRange {
  startDate: string;
  endDate: string;
}

export interface RunTimePeriodRange {
  startDate: string;
  endDate: string;
  name: string;
}

export interface SimulationRunConfig {
  initialLiquidityPool: LiquidityPool;
  simulationLiquidityPools: LiquidityPool[];
  selectedUpdateRulesToSimulate: UpdateRule[];
  gasPriceImport: GasStep[];
  simulationRunning: boolean;
  dateRangesToRun: RunTimePeriodRange[];
  startDate: string;
  endDate: string;
  availableCoins: Coin[];
  availableUpdateRules: UpdateRule[];
  availablePoolTypes: PoolType[];
  availableFeeHooks: FeeHook[];
  selectedCoinsToAddToPool: Coin[];
  selectedSimplifiedPools: string[];
  selectedInitialCoinMarketValue: number | null;
  status: SimulationRunProgress;
  coinLoadStatus: string[];
  coinPriceHistoryLoaded: boolean;
  coinPriceHistoryLoadedStatus: string;
  exampleSimRunPeriods: RunTimePeriodRange[];
  trainingParameters: TrainingParametersDto;
  simulationSimplifiedIncludeLvrRuns: boolean;
  simulationSimplifiedIncludeRvrRuns: boolean;
}

export interface SimulationRunProgress {
  status: string;
  priceHistoryLoad: number;
  simulationRunProgress: number;
}
