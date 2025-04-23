import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const selectSimulationRunnerStatus = (state: RootState) =>
  state.simRunner.simulationRunStatus;

export const selectProducts = (state: RootState) => {
  return state.productExplorer.productMap;
};

export const selectProductById = (
  products: ProductMap,
  id: string
): Product | undefined => {
  console.log('products ==>', products);
  return products[id];
};

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

export const selectReturnAnalysisByProductId = (
  state: RootState,
  id: string
) => {
  const targetProduct = state.productExplorer.productMap[id];

  if (targetProduct) {
    return (
      targetProduct.simulationRunBreakdown?.simulationRunResultAnalysis?.return_analysis
        // filter out absolute return metric
        .filter((element) => element.metricName !== 'Absolute Return (%)')
    );
  }

  return null;
};

export const selectBenchmarkAnalysisByProductId = (
  state: RootState,
  id: string,
  benchmarkName: string | null
) => {
  const targetProduct = state.productExplorer.productMap[id];

  if (targetProduct && benchmarkName) {
    return targetProduct.simulationRunBreakdown?.simulationRunResultAnalysis?.benchmark_analysis.filter(
      (element) => element.benchmarkName === benchmarkName
    );
  } else if (targetProduct && !benchmarkName) {
    //the return analysis metrics of the benchmark itself
    return targetProduct.simulationRunBreakdown?.simulationRunResultAnalysis?.benchmark_analysis.filter(
      (element) =>
        element.benchmarkName === undefined || element.benchmarkName === ''
    );
  }

  return null;
};

// TODO: temporary function, should come from the backend
const getMetricKey = (metricName: string) => {
  return metricName.toLowerCase().replace(/ /g, '_');
};

export const selectTimeseriesAnalysisByProductId = (
  state: RootState,
  id: string
) => {
  const targetProduct = state.productExplorer.productMap[id];

  if (targetProduct) {
    const result =
      targetProduct.simulationRunBreakdown?.simulationRunResultAnalysis?.return_timeseries_analysis.map(
        (element) => {
          return {
            ...element,
            metricKey: getMetricKey(element.metricName),
          };
        }
      );

    return result;
  }

  return null;
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
} = productExplorerSlice.actions;

export default productExplorerSlice.reducer;
