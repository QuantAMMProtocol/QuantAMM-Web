import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import simulationConfigReducer from '../features/simulationRunConfiguration/simulationRunConfigurationSlice';
import simulationRunnerReducer from '../features/simulationRunner/simulationRunnerSlice';
import simulationResultsReducer from '../features/simulationResults/simulationResultSlice';
import documentationReducer from '../features/documentation/documentationSlice';

import { simulationRunnerService } from '../features/simulationRunner/simulationRunnerService';
import { coinPriceRetrievalService } from '../features/coinData/coinPriceRetrievalService';
import { DocumentationService } from '../features/documentation/documentationService';
import themeReducer from '../features/themes/themeSlice';
import {
  filtersRetrievalService,
  productRetrievalService,
} from '../services/productRetrievalService';
import { productExplorerReducer } from '../features';
import { financialAnalysisService } from '../services/financialAnalysisService';

enableMapSet();

export const store = configureStore({
  reducer: {
    simConfig: simulationConfigReducer,
    docs: documentationReducer,
    simRunner: simulationRunnerReducer,
    simResults: simulationResultsReducer,
    productExplorer: productExplorerReducer,
    theme: themeReducer,

    [simulationRunnerService.reducerPath]: simulationRunnerService.reducer,
    [coinPriceRetrievalService.reducerPath]: coinPriceRetrievalService.reducer,
    [DocumentationService.reducerPath]: DocumentationService.reducer,
    [productRetrievalService.reducerPath]: productRetrievalService.reducer,
    [filtersRetrievalService.reducerPath]: filtersRetrievalService.reducer,
    [financialAnalysisService.reducerPath]: financialAnalysisService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(simulationRunnerService.middleware)
      .concat(coinPriceRetrievalService.middleware)
      .concat(DocumentationService.middleware)
      .concat(productRetrievalService.middleware)
      .concat(filtersRetrievalService.middleware)
      .concat(financialAnalysisService.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
