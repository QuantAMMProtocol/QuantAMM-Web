import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  FilterList,
  OverrideTab,
  Product,
  ProductExplorerSortMetric,
  SortingDirection,
  TimeRange,
} from '../../models';
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
    loadingProducts: (state) => {
      state.loadingProducts = true;
    },
    loadProducts: (state, action: PayloadAction<Product[]>) => {
      state.originalProducts = action.payload;
      state.filteredProducts = action.payload;
      state.loadingProducts = false;
    },
    loadingFilters: (state) => {
      state.loadingFilters = true;
    },
    loadFilters: (state, action: PayloadAction<FilterList>) => {
      state.originalFilters = action.payload;
      state.loadingFilters = false;
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
    setFilters: (
      state,
      action: PayloadAction<{
        filterCategory?: string;
        filter?: string;
        minTvl?: number;
      }>
    ) => {
      const { filterCategory, filter, minTvl } = action.payload;
      const newFilters = { ...state.activeFilters };

      if (filterCategory && filter) {
        if (newFilters[filterCategory]?.includes(filter)) {
          newFilters[filterCategory] = newFilters[filterCategory].filter(
            (f) => f !== filter
          );
          if (newFilters[filterCategory].length === 0)
            delete newFilters[filterCategory];
        } else {
          newFilters[filterCategory] = newFilters[filterCategory]
            ? [...newFilters[filterCategory], filter]
            : [filter];
        }
        state.activeFilters = newFilters;
      } else if (filterCategory === 'tvl') {
        state.activeFilters = {
          ...state.activeFilters,
          minTvl: [minTvl?.toString() ?? ''],
        };
      } else {
        state.activeFilters = {};
      }

      state.filteredProducts = state.originalProducts.filter((product) => {
        return Object.keys(state.activeFilters).every(
          (category) =>
            !state.activeFilters[category] ||
            state.activeFilters[category].includes((product as any)[category])
        );
      });
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
      const targetProduct = state.filteredProducts.find(
        (product) => product.id === action.payload.productId
      );
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
  },
});

export const selectSimulationRunnerStatus = (state: RootState) =>
  state.simRunner.simulationRunStatus;

export const selectProducts = (state: RootState) => {
  return state.productExplorer.filteredProducts;
};

export const selectProductById = (
  products: Product[],
  id: string
): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const excludeProductById = (
  products: Product[],
  id: string
): Product[] | [] => {
  return products.filter((product) => product.id !== id) ?? [];
};

export const selectLoadingProducts = (state: RootState) =>
  state.productExplorer.loadingProducts;

export const selectFilters = (state: RootState) =>
  state.productExplorer.originalFilters;

export const selectActiveFilters = (state: RootState) =>
  state.productExplorer.activeFilters;

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
  const targetProduct = state.productExplorer.filteredProducts.find(
    (product) => product.id === id
  );

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
  const targetProduct = state.productExplorer.filteredProducts.find(
    (product) => product.id === id
  );

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
  const targetProduct = state.productExplorer.filteredProducts.find(
    (product) => product.id === id
  );

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

export const selectHorizontalView = (state: RootState) =>
  state.productExplorer.horizontalView;

export const {
  loadingProducts,
  loadProducts,
  loadingFilters,
  loadFilters,
  loadingError,
  setFilters,
  setSortingMetric,
  loadingSimulationRunBreakdown,
  setProductSimulationRunBreakdown,
  setSortingDirection,
  setOverrideTab,
  setPoolDetailSelectedGraphRange,
} = productExplorerSlice.actions;

export default productExplorerSlice.reducer;
