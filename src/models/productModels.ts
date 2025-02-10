import { GqlPoolDynamicData } from '../__generated__/graphql-types';
import { SimulationRunBreakdown } from '../features/simulationResults/simulationResultSummaryModels';

export type BalancerTokenType =
  | 'COMPOSABLE_STABLE'
  | 'ELEMENT'
  | 'FX'
  | 'GYRO'
  | 'GYRO3'
  | 'GYROE'
  | 'INVESTMENT'
  | 'LINEAR'
  | 'LIQUIDITY_BOOTSTRAPPING'
  | 'META_STABLE'
  | 'PHANTOM_STABLE'
  | 'STABLE'
  | 'UNKNOWN'
  | 'WEIGHTED';

export type ChainType =
  | 'BASE'
  | 'ARBITRUM'
  | 'MAINNET'
  | 'AVALANCHE'
  | 'FANTOM'
  | 'GNOSIS'
  | 'OPTIMISM'
  | 'POLYGON'
  | 'SEPOLIA'
  | 'ZKEVM';

export type ProductOverviewMetric =
  | 'tvl'
  | 'yield'
  | 'diversification'
  | 'adaptability'
  | 'performance';

export enum StrategyEnum {
  MOMENTUM,
  ANTI_MOMENTUM,
  CHANNEL_FOLLOWING,
  POWER_CHANNEL,
  MIN_VARIANCE,
  NONE,
}

export type Strategy = keyof typeof StrategyEnum;

export interface TimeSeriesData {
  timestamp: number;
  amounts: number[];
  fees24h: number;
  sharePrice: number;
  totalShares: number;
  totalLiquidity: number;
  totalSwapVolume: number;
  volume24h: number;
  tokenPrices: Record<string, number>;
  hodlSharePrice: number;
}

export interface PoolTimeSeriesData {
  poolId: string;
  chain: string;
  timeSeries: TimeSeriesData[];
}

export interface DailyPerformance {
  date: string;
  value: number;
}

export interface MonthlyPerformance {
  month: string;
  value: number;
}

export interface ProductPoolConstituents {
  coin: string;
  weight: number;
  address: string;
}

export interface PerformancePeriod {
  sharePrice: number;
  return: number;
}

export interface ProductDto {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  basketTheme: string;
  tokenType: string;
  strategy: Strategy;
  chain: string;
  frequency: string;
  memory: number;
  market: string;
  createTime: string;
  swapManager: string;
  pauseManager: string;
  disableUnbalancedLiquidity?: boolean;
  enableAddLiquidityCustom?: boolean;
  enableDonation?: boolean;
  enableRemoveLiquidityCustom?: boolean;
  poolConstituents: ProductPoolConstituents[];
  dailyPerformance: DailyPerformance[];
  monthlyPerformance: MonthlyPerformance[];
  inceptionPerformance: PerformancePeriod;
  oneYearPerformance: PerformancePeriod;
  sixMonthPerformance: PerformancePeriod;
  threeMonthPerformance: PerformancePeriod;
  oneMonthPerformance: PerformancePeriod;
  oneWeekPerformance: PerformancePeriod;
  timeSeries: TimeSeriesData[];
  benchmarkTimeSeries: TimeSeriesData[][] | undefined;
  benchmarkNames: string[] | undefined;
  currentPerformance: number;
  overview: {
    metric: ProductOverviewMetric;
    value: number;
    maxScore: number;
    description: string;
  }[];
  dynamicData: GqlPoolDynamicData;
}

export type Product = ProductDto & {
  simulationRunBreakdown?: SimulationRunBreakdown;
};

export type FilterDto = Record<string, string[]>[];

export type FilterMap = Record<string, string[]>;

export type FilterList = FilterDto;

export type OverrideTab = 'overview' | 'performance' | 'tokens';

export type ProductExplorerSortMetric =
  | ProductOverviewMetric
  | 'age'
  | 'sharePrice';

export interface FinancialMetricThresholds {
  key: string;
  veryLow: number;
  veryLowColor: string;
  low: number;
  lowColor: string;
  medium: number;
  mediumColor: string;
  high: number;
  highColor: string;
}

export interface ProductExplorer {
  loadingProducts: boolean;
  loadingFilters: boolean;
  loadingError: boolean;
  loadingSimulationRunBreakdown: Record<string, boolean>;
  asOfUnixTime: number;
  blockIndex: number;
  originalProducts: Product[];
  filteredProducts: Product[];
  originalFilters: FilterList;
  activeFilters: FilterMap;
  sortingDirection: SortingDirection;
  sortingMetric: ProductExplorerSortMetric;
  overrideTab?: OverrideTab;
  horizontalView: boolean;
  returnMetricThresholds: FinancialMetricThresholds[];
  benchmarkMetricThresholds: FinancialMetricThresholds[];
  poolDetailSelectedGraphRange: TimeRange;
}

export interface ProductMetric {
  asOfUnixTime: number;
  blockIndex: number;
  inflows: ProductFlows[];
  outflows: ProductFlows[];
  tradeFlows: ProductFlows[];
  feesCollected: ProductFlows[];
}

export interface ProductFlows {
  flowUnixTime: number;
  flows: ProductConstituentEvent[];
  flowAddress: string;
  flowUniqueId: string;
}

export interface ProductConstituentEvent {
  constituent: string;
  amount: number;
  direction: string;
}

export type SortingDirection = 'asc' | 'desc';

export type TimeRange = '7d' | '1m' | '3m' | '1y' | 'max';

export const timeRanges: TimeRange[] = ['7d', '1m', '3m', '1y', 'max'];

export type ExtendedTimeRange = TimeRange | '6m';
