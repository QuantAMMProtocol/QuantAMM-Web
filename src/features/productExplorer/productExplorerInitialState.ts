import {
  benchmarkMetricThresholds,
  INITIAL_LOAD_POOLS_COUNT,
  INITIAL_PAGE,
  returnMetricThresholds,
} from '../../models';
import { ProductExplorer } from '../../models/productModels';
import { getCookieBool, TOS_COOKIE } from './cookieUtils';
export const productExplorerInitialState: ProductExplorer = {
  acceptedTermsAndConditions: getCookieBool(TOS_COOKIE),
  loadingProducts: true,
  loadingFilters: true,
  loadingError: false,
  loadingJsonProductSimulations: false,
  loadingSimulationRunBreakdown: {},
  asOfUnixTime: 0,
  blockIndex: 0,
  productMap: {},
  originalFilters: [],
  activeFilters: {},
  textSearch: '',
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
