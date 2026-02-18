import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  FilterList,
  INITIAL_PAGE,
  OverrideTab,
  Product,
  ProductExplorerSortMetric,
  ProductMap,
  SortingDirection,
  TimeRange,
} from '../../models';
import { FilterPayload, updateFilters } from '../../utils/filters';
import { SimulationRunBreakdown } from '../simulationResults/simulationResultSummaryModels';
import { productExplorerInitialState } from './productExplorerInitialState';
import { deleteCookie, setCookie, TOS_COOKIE } from './cookieUtils';

interface ProductSimulationRunBreakdown {
  simulationRunBreakdown: SimulationRunBreakdown;
  productId: string;
}

export const productExplorerSlice = createSlice({
  name: 'productExplorerSlice',
  initialState: productExplorerInitialState,
  reducers: {
    setLoadingProducts: (state) => {
      state.loadingProducts = true;
    },
    loadProducts: (state, action: PayloadAction<ProductMap>) => {
      state.productMap = {
        ...state.productMap,
        ...action.payload,
      };
      state.loadingProducts = false;
    },
    loadingFilters: (state) => {
      state.loadingFilters = true;
    },
    loadFilters: (state, action: PayloadAction<FilterList>) => {
      state.originalFilters = action.payload;
      state.loadingFilters = false;
    },
    setTextSearch: (state, action: PayloadAction<string>) => {
      state.textSearch = action.payload;
    },
    loadingError: (state, action: PayloadAction<boolean>) => {
      state.loadingError = action.payload;
    },
    setPoolDetailSelectedGraphRange: (
      state,
      action: PayloadAction<TimeRange>
    ) => {
      state.poolDetailSelectedGraphRange = action.payload;
    },
    setAcceptedTermsAndConditions: (state, action: PayloadAction<boolean>) => {
      state.acceptedTermsAndConditions = action.payload;
      if (action.payload) {
        setCookie(TOS_COOKIE, '1');
      } else {
        deleteCookie(TOS_COOKIE);
      }
    },
    setFilters: (state, action: PayloadAction<FilterPayload>) => {
      state.loadingProducts = true;
      state.productMap = {};
      state.page = INITIAL_PAGE;

      state.activeFilters = updateFilters(action.payload, state.activeFilters);
    },
    setSortingMetric: (
      state,
      action: PayloadAction<ProductExplorerSortMetric>
    ) => {
      state.sortingMetric = action.payload;
    },
    loadingSimulationRunBreakdown: (state, action: PayloadAction<string>) => {
      state.loadingSimulationRunBreakdown[action.payload] = true;
    },
    setProductSimulationRunBreakdown: (
      state,
      action: PayloadAction<ProductSimulationRunBreakdown>
    ) => {
      const targetProduct = state.productMap[action.payload.productId];
      if (targetProduct) {
        targetProduct.simulationRunBreakdown =
          action.payload.simulationRunBreakdown;

        state.loadingSimulationRunBreakdown[action.payload.productId] = false;
      }
    },
    setSortingDirection: (state, action: PayloadAction<SortingDirection>) => {
      state.sortingDirection = action.payload;
    },
    setLoadingJsonProductSimulations: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loadingJsonProductSimulations = action.payload;
    },
    setOverrideTab: (state, action: PayloadAction<OverrideTab | undefined>) => {
      state.overrideTab = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.loadingProducts = true;
      state.pageSize = action.payload;
      state.page = INITIAL_PAGE;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.productMap = {};
      state.loadingProducts = true;
      state.page = action.payload;
    },
    setTotalPools: (state, action: PayloadAction<number | undefined>) => {
      state.totalPools = action.payload;
    },
  },
});

export const selectProducts = (state: RootState) => {
  return state.productExplorer.productMap;
};

export const selectProductById = (
  state: RootState,
  id: string
): Product | undefined => {
  return state.productExplorer.productMap[id];
};

export const selectAcceptedTermsAndConditions = (state: RootState) =>
  state.productExplorer.acceptedTermsAndConditions;

export const selectLoadingProducts = (state: RootState) =>
  state.productExplorer.loadingProducts;

export const selectFilters = (state: RootState) =>
  state.productExplorer.originalFilters;

export const selectActiveFilters = (state: RootState) =>
  state.productExplorer.activeFilters;

export const selectTextSearch = (state: RootState) =>
  state.productExplorer.textSearch;

export const selectLoadingError = (state: RootState) =>
  state.productExplorer.loadingError;

export const selectLoadingFilters = (state: RootState) =>
  state.productExplorer.loadingFilters;

export const selectSortingDirection = (state: RootState) =>
  state.productExplorer.sortingDirection;

export const selectSortingMetric = (state: RootState) =>
  state.productExplorer.sortingMetric;

export const selectOverrideTab = (state: RootState) =>
  state.productExplorer.overrideTab;

export const selectReturnMetricThresholds = (state: RootState) =>
  state.productExplorer.returnMetricThresholds;

export const selectProductDetailSelectedTimeRange = (state: RootState) =>
  state.productExplorer.poolDetailSelectedGraphRange;

export const selectBenchmarkMetricThresholds = (state: RootState) => {
  return state.productExplorer.benchmarkMetricThresholds;
};

export const selectRetunMetricKeyNames = (state: RootState) => {
  return state.productExplorer.returnMetricThresholds.map((element) => {
    return element.key;
  });
};

export const selectBenchmarkMetricKeyNames = (state: RootState) => {
  return state.productExplorer.benchmarkMetricThresholds.map((element) => {
    return element.key;
  });
};

export const selectLoadingSimulationRunBreakdown = (
  state: RootState,
  productId: string
) => state.productExplorer.loadingSimulationRunBreakdown[productId];

export const selectLoadingJsonBreakdown = (state: RootState) =>
  state.productExplorer.loadingJsonProductSimulations;

const getProductById = (state: RootState, id: string) =>
  state.productExplorer.productMap[id];

const filterReturnAnalysis = (targetProduct?: Product) =>
  targetProduct?.simulationRunBreakdown?.simulationRunResultAnalysis?.return_analysis
    // filter out absolute return metric
    .filter((element) => element.metricName !== 'Absolute Return (%)') ?? null;

const filterBenchmarkAnalysis = (
  targetProduct: Product | undefined,
  benchmarkName: string | null
) => {
  if (targetProduct && benchmarkName) {
    return targetProduct.simulationRunBreakdown?.simulationRunResultAnalysis?.benchmark_analysis.filter(
      (element) => element.benchmarkName === benchmarkName
    );
  }
  if (targetProduct && !benchmarkName) {
    // the return analysis metrics of the benchmark itself
    return targetProduct.simulationRunBreakdown?.simulationRunResultAnalysis?.benchmark_analysis.filter(
      (element) =>
        element.benchmarkName === undefined || element.benchmarkName === ''
    );
  }
  return null;
};

const mapTimeseriesAnalysis = (targetProduct?: Product) =>
  targetProduct?.simulationRunBreakdown?.simulationRunResultAnalysis?.return_timeseries_analysis.map(
    (element) => ({
      ...element,
      metricKey: getMetricKey(element.metricName),
    })
  ) ?? null;

const returnAnalysisSelectorCache = new Map<
  string,
  (state: RootState) => ReturnType<typeof filterReturnAnalysis>
>();

export const selectReturnAnalysisByProductId = (state: RootState, id: string) => {
  let selector = returnAnalysisSelectorCache.get(id);
  if (!selector) {
    selector = createSelector(
      [(rootState: RootState) => getProductById(rootState, id)],
      (targetProduct) => filterReturnAnalysis(targetProduct)
    );
    returnAnalysisSelectorCache.set(id, selector);
  }
  return selector(state);
};

const benchmarkAnalysisSelectorCache = new Map<
  string,
  (state: RootState) => ReturnType<typeof filterBenchmarkAnalysis>
>();

export const selectBenchmarkAnalysisByProductId = (
  state: RootState,
  id: string,
  benchmarkName: string | null
) => {
  const cacheKey = `${id}::${benchmarkName ?? '__default__'}`;
  let selector = benchmarkAnalysisSelectorCache.get(cacheKey);
  if (!selector) {
    selector = createSelector(
      [(rootState: RootState) => getProductById(rootState, id)],
      (targetProduct) => filterBenchmarkAnalysis(targetProduct, benchmarkName)
    );
    benchmarkAnalysisSelectorCache.set(cacheKey, selector);
  }
  return selector(state);
};

const getMetricKey = (metricName: string) => {
  return metricName.toLowerCase().replace(/ /g, '_');
};

const timeseriesAnalysisSelectorCache = new Map<
  string,
  (state: RootState) => ReturnType<typeof mapTimeseriesAnalysis>
>();

export const selectTimeseriesAnalysisByProductId = (
  state: RootState,
  id: string
) => {
  let selector = timeseriesAnalysisSelectorCache.get(id);
  if (!selector) {
    selector = createSelector(
      [(rootState: RootState) => getProductById(rootState, id)],
      (targetProduct) => mapTimeseriesAnalysis(targetProduct)
    );
    timeseriesAnalysisSelectorCache.set(id, selector);
  }
  return selector(state);
};

export const selectPageSize = (state: RootState) =>
  state.productExplorer.pageSize;

export const selectPage = (state: RootState) => state.productExplorer.page;

export const selectTotalPools = (state: RootState) =>
  state.productExplorer.totalPools;

export const selectHorizontalView = (state: RootState) =>
  state.productExplorer.horizontalView;

export const {
  setLoadingProducts,
  loadProducts,
  loadingFilters,
  loadFilters,
  loadingError,
  setFilters,
  setTextSearch,
  setSortingMetric,
  loadingSimulationRunBreakdown,
  setProductSimulationRunBreakdown,
  setSortingDirection,
  setOverrideTab,
  setPoolDetailSelectedGraphRange,
  setPageSize,
  setPage,
  setTotalPools,
  setAcceptedTermsAndConditions,
  setLoadingJsonProductSimulations,
} = productExplorerSlice.actions;

export default productExplorerSlice.reducer;
