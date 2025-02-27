import {
  benchmarkMetricThresholds,
  INITIAL_LOAD_POOLS_COUNT,
  INITIAL_PAGE,
  returnMetricThresholds,
} from '../../models';
import { ProductExplorer } from '../../models/productModels';

export const productExplorerInitialState: ProductExplorer = {
  loadingProducts: true,
  loadingFilters: true,
  loadingError: false,
  loadingSimulationRunBreakdown: {},
  asOfUnixTime: 0,
  blockIndex: 0,
  productMap: {},
  originalFilters: [],
  activeFilters: {},
  sortingMetric: 'tvl',
  sortingDirection: 'desc',
  overrideTab: undefined,
  horizontalView: true,
  poolDetailSelectedGraphRange: 'max',
  returnMetricThresholds,
  benchmarkMetricThresholds,
  pageSize: INITIAL_LOAD_POOLS_COUNT,
  page: INITIAL_PAGE,
};
