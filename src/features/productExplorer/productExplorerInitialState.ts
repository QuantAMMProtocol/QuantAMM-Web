import {
  benchmarkMetricThresholds,
  INITIAL_LOAD_POOLS_COUNT,
  INITIAL_PAGE,
  returnMetricThresholds,
} from '../../models';
import { ProductExplorer } from '../../models/productModels';


// ----- Cookie helpers (SSR-safe) -----
const TOS_COOKIE = 'quantamm_tos_accepted';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

function getCookie(name: string): string | null {
  if (!isBrowser) return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function getCookieBool(name: string, fallback = false): boolean {
  const v = getCookie(name);
  if (v === null) return fallback;
  console.log('Cookie', name, 'is', v);
  return v === '1';
}
export const productExplorerInitialState: ProductExplorer = {
  acceptedTermsAndConditions:getCookieBool(TOS_COOKIE),
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
  quantammSetPools: {
    '0x6b61d8680c4f9e560c8306807908553f95c749c5': 'safeHavenBTFAugTest',
    '0xb4161aea25bd6c5c8590ad50deb4ca752532f05d': 'baseMacroBTFAugTest',
    '0x74dc857d5567a3b087e79b96b91cdc8099b2fa34': 'sonicMacroBTFAprilTest',
  }
};
