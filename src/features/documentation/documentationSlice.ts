import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import { TrainingResult } from './docModel';

export interface DocumentationState {
  updateRuleTrainingFilter: LoadUpdateRuleTrainingFilterDto;
  updateRuleTrainingResults: TrainingResult;
  updateRuleTrainingLoadState: boolean;
}

export interface LoadUpdateRuleTrainingFilterDto {
  basket: string;
  updateRule: string;
  parameterType: string;
  startDate: string;
  endDate: string;
  trainingWindow: string;
  memorySettings: string;
  tradingFunction: string;
  strategyRefresh: string;
}

const initialState: DocumentationState = {
  updateRuleTrainingLoadState: false,
  updateRuleTrainingFilter: {
    basket: '',
    updateRule: '',
    parameterType: '',
    startDate: '',
    endDate: '',
    trainingWindow: '',
    memorySettings: '',
    tradingFunction: '',
    strategyRefresh: '',
  },
  updateRuleTrainingResults: {
    batch_size: 0,
    n_parameter_sets: 0,
    decay_lr_plateau: 0,
    decay_lr_ratio: '',
    optimiser: '',
    objective: [],
    train_objective: [],
    test_objective: [],
  },
};

export const documentationSlice = createSlice({
  name: 'docState',
  initialState,
  reducers: {
    setUpdateRuleTrainingLoadState: (state, action: PayloadAction<boolean>) => {
      state.updateRuleTrainingLoadState = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.endDate = action.payload;
    },
    setBasket: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.basket = action.payload;
    },
    setUpdateRule: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.updateRule = action.payload;
    },
    setParameterType: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.parameterType = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.startDate = action.payload;
    },
    setTrainingWindow: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.endDate = action.payload;
    },
    setMemorySettings: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.memorySettings = action.payload;
    },
    setTradingFunction: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.endDate = action.payload;
    },
    setStrategyRefresh: (state, action: PayloadAction<string>) => {
      state.updateRuleTrainingFilter.strategyRefresh = action.payload;
    },
    setTrainingResult: (state, action: PayloadAction<TrainingResult>) => {
      state.updateRuleTrainingResults = action.payload;
    },
  },
});

export const {
  setEndDate,
  setBasket,
  setMemorySettings,
  setParameterType,
  setStartDate,
  setStrategyRefresh,
  setTradingFunction,
  setTrainingWindow,
  setUpdateRule,
  setUpdateRuleTrainingLoadState,
  setTrainingResult,
} = documentationSlice.actions;

export const selectBasket = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.basket;
export const selectEndDate = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.endDate;
export const selectStartDate = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.startDate;
export const selectUpdateRule = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.updateRule;
export const selectParameterType = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.parameterType;
export const selectTrainingWindow = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.trainingWindow;
export const selectMemorySettings = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.memorySettings;
export const selectTradingFunction = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.tradingFunction;
export const selectStrategyRefresh = (state: RootState) =>
  state.docs.updateRuleTrainingFilter.strategyRefresh;
export const selectUpdateRuleTrainingFilter = (state: RootState) =>
  state.docs.updateRuleTrainingFilter;

export default documentationSlice.reducer;
