import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SimulationRunner } from './simulationRunnerModels';
import {
  LiquidityPool,
  RunTimePeriodRange,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import { RootState } from '../../app/store';
import {
  SimulationRunBreakdown,
  SimulationRunLiquidityPoolSnapshot,
} from '../simulationResults/simulationResultSummaryModels';
import {
  clonePool,
  clonePoolFingerPrint,
  updatePoolAmounts,
  updatePoolWeights,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationResultAnalysisDto } from './simulationRunnerDtos';

const initialState: SimulationRunner = {
  simulationsToRun: [],
  simulationRunBreakdowns: [],
  simulationRunStatus: 'Pending',
  simulationRunStatusStepIndex: 0,
  simulationRunnerCurrentStepIndex: 0,
  simulationRunnerCurrentRunTypeIndex: 0,
  simulationRunnerTimeRangeSelection: 'custom',
  simulationResultTimeRangeSelection: 'custom',
  simulationResultChartSelection: 'MarketValueOverTime',
  simulationResultBreakdownSelection: 'MvSummary',
  simulationRunProgressPercent: 0,
  runTimePeriodRanges: [
    {
      startDate: '2020-11-20 00:00:00',
      endDate: '2022-07-22 00:00:00',
      name: 'super cycle',
    },
    {
      startDate: '2020-11-20 00:00:00',
      endDate: '2021-05-11 00:00:00',
      name: 'bull run 1',
    },
    {
      startDate: '2021-11-15 00:00:00',
      endDate: '2022-07-10 00:00:00',
      name: 'bear run 1',
    },
    {
      startDate: '2021-07-10 00:00:00',
      endDate: '2021-11-15 00:00:00',
      name: 'bull run 2',
    },
    {
      startDate: '2021-03-14 00:00:00',
      endDate: '2021-07-23 00:00:00',
      name: 'bear run 2',
    },
  ],
};

export function getSimulationRunStatusIndex(
  status: string,
  poolsToRun: SimulationRunBreakdown[]
) {
  switch (status) {
    case 'Pending':
      return 0;
    case 'Running':
      return 1;
    case 'Complete': {
      if (poolsToRun.find((x) => !x.simulationComplete) == undefined) {
        return 2;
      } else {
        return -1;
      }
    }
  }

  return 0;
}

export const simulationRunnerSlice = createSlice({
  name: 'simulationRunnerSlice',
  initialState: initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<string>) => {
      state.simulationRunStatus = action.payload;
      const newIndex = getSimulationRunStatusIndex(
        action.payload,
        state.simulationRunBreakdowns
      );
      if (newIndex > 0) {
        state.simulationRunStatusStepIndex = newIndex;
      }
    },
    updateProgressPercent: (state) => {
      const totalSimsToRun = state.simulationsToRun.length;
      const completedSims = state.simulationRunBreakdowns.filter(
        (x) => x.simulationComplete
      ).length;
      state.simulationRunProgressPercent =
        (completedSims / totalSimsToRun) * 100;
    },
    startRun: (
      state,
      action: PayloadAction<{
        pool: LiquidityPool;
        timeRange: RunTimePeriodRange;
      }>
    ) => {
      const statePool = state.simulationsToRun.find(
        (x) => x.id == action.payload.pool.id
      );
      if (statePool != undefined) {
        updatePoolAmounts(
          action.payload.timeRange.startDate,
          statePool.poolConstituents
        );
        updatePoolWeights(statePool.poolConstituents);
      }
      state.simulationRunBreakdowns.push({
        simulationRun: action.payload.pool,
        timeRange: action.payload.timeRange,
        simulationRunStatus: 'running',
        simulationComplete: false,
        flatSimulationRunResult: undefined,
        simulationRunResultAnalysis: undefined,
        timeSteps: [],
      });
    },
    changeSimulationRunnerCurrentStepIndex: (
      state,
      action: PayloadAction<number>
    ) => {
      state.simulationRunnerCurrentStepIndex = action.payload;
    },
    changeSimulationRunnerCurrentRunTypeIndex: (
      state,
      action: PayloadAction<number>
    ) => {
      state.simulationRunnerCurrentRunTypeIndex = action.payload;
    },
    changeChartSelected: (state, action: PayloadAction<string>) => {
      state.simulationResultChartSelection = action.payload;
    },
    changeRunnerTimeRangeSelected: (state, action: PayloadAction<string>) => {
      state.simulationRunnerTimeRangeSelection = action.payload;
    },
    changeVisualisationTimeRangeSelected: (
      state,
      action: PayloadAction<string>
    ) => {
      state.simulationResultTimeRangeSelection = action.payload;
    },
    changeBreakdownSelected: (state, action: PayloadAction<string>) => {
      state.simulationResultBreakdownSelection = action.payload;
    },
    addSimulationsToRun: (
      state,
      action: PayloadAction<{ pool: LiquidityPool }>
    ) => {
      state.simulationsToRun.push(clonePool(action.payload.pool));
    },
    addImportedSimRunResults: (
      state,
      action: PayloadAction<SimulationRunBreakdown>
    ) => {
      state.simulationRunBreakdowns.push(action.payload);
    },
    addSimRunResults: (
      state,
      action: PayloadAction<{
        id: { runId: string; timeRangeName: string };
        results: SimulationRunLiquidityPoolSnapshot[];
        analysisResults: SimulationResultAnalysisDto;
      }>
    ) => {
      const sim = state.simulationRunBreakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.id.runId &&
          x.timeRange.name == action.payload.id.timeRangeName
      );

      if (sim != undefined) {
        sim.timeSteps = [...sim.timeSteps, ...action.payload.results];
        sim.simulationRunResultAnalysis = action.payload.analysisResults;
      }
    },
    importSimRunResults: (
      state,
      action: PayloadAction<{
        simulationRunner: SimulationRunBreakdown;
      }>
    ) => {
      state.simulationRunBreakdowns.push(action.payload.simulationRunner);
    },
    resetSimulationRunner: (state) => {
      state.simulationRunBreakdowns = [];
      state.simulationRunProgressPercent = 0;
      state.simulationsToRun = [];
      state.simulationRunStatus = 'Pending';
      state.simulationRunStatusStepIndex = 0;
      state.simulationRunnerCurrentStepIndex = 0;
      state.runTimePeriodRanges = initialState.runTimePeriodRanges;
    },
    addFingerprintToSimulationsToRun: (
      state,
      action: PayloadAction<{ pool: LiquidityPool; updateRuleSimKey: string }>
    ) => {
      state.simulationsToRun.push(
        clonePoolFingerPrint(
          action.payload.pool,
          action.payload.updateRuleSimKey
        )
      );
    },
    completeRun: (
      state,
      action: PayloadAction<{ id: string; timeRangeName: string }>
    ) => {
      const sim = state.simulationRunBreakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.id &&
          x.timeRange.name == action.payload.timeRangeName
      );
      if (sim != undefined) {
        sim.simulationComplete = true;
        sim.simulationRunStatus = 'Complete';
      }
    },
    failRun: (
      state,
      action: PayloadAction<{
        id: string;
        timeRangeName: string;
        errorMessage: string;
      }>
    ) => {
      const sim = state.simulationRunBreakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.id &&
          x.timeRange.name == action.payload.timeRangeName
      );
      if (sim != undefined) {
        sim.simulationComplete = true;
        sim.simulationRunStatus = action.payload.errorMessage;
      }
    },
    completeSimulation: (state) => {
      state.simulationsToRun = [];
    },
    initializeSimulationsToRun: (
      state,
      action: PayloadAction<{ pools: LiquidityPool[] }>
    ) => {
      state.simulationsToRun = action.payload.pools.map((x) => clonePool(x));
    },
    initializeTimeRangeToRun: (
      state,
      action: PayloadAction<{
        name: string;
        custStartDate: string;
        custEndDate: string;
      }>
    ) => {
      if (action.payload.name == 'custom') {
        state.runTimePeriodRanges = [
          {
            name: 'custom',
            startDate: action.payload.custStartDate,
            endDate: action.payload.custEndDate,
          },
        ];
      } else {
        state.runTimePeriodRanges = initialState.runTimePeriodRanges;
        state.simulationResultTimeRangeSelection =
          initialState.runTimePeriodRanges[0].name;
      }
    },
  },
});

export const selectSimulationRunnerStatus = (state: RootState) =>
  state.simRunner.simulationRunStatus;
export const selectSimulationRunnerProgressPercent = (state: RootState) =>
  state.simRunner.simulationRunProgressPercent;
export const selectSimulationRunBreakdowns = (state: RootState) =>
  state.simRunner.simulationRunBreakdowns;
export const selectSimulationsToRun = (state: RootState) =>
  state.simRunner.simulationsToRun;
export const selectSimulationRunnerTimeRanges = (state: RootState) =>
  state.simRunner.runTimePeriodRanges;
export const selectSimulationResultChartSelection = (state: RootState) =>
  state.simRunner.simulationResultChartSelection;
export const selectSimulationResultBreakdownSelection = (state: RootState) =>
  state.simRunner.simulationResultBreakdownSelection;
export const selectSimulationRunStatusStepIndex = (state: RootState) =>
  state.simRunner.simulationRunStatusStepIndex;
export const selectSimulationRunnerCurrentRunTypeIndex = (state: RootState) =>
  state.simRunner.simulationRunnerCurrentRunTypeIndex;
export const selectSimulationRunnerCurrentStepIndex = (state: RootState) =>
  state.simRunner.simulationRunnerCurrentStepIndex;
export const selectSimulationResultTimeRangeSelection = (state: RootState) =>
  state.simRunner.simulationResultTimeRangeSelection;
export const selectSimulationRunnerTimeRangeSelection = (state: RootState) =>
  state.simRunner.simulationRunnerTimeRangeSelection;

export const {
  updateProgressPercent,
  updateStatus,
  initializeSimulationsToRun,
  startRun,
  completeRun,
  completeSimulation,
  addSimRunResults,
  importSimRunResults,
  addSimulationsToRun,
  initializeTimeRangeToRun,
  changeChartSelected,
  changeBreakdownSelected,
  changeVisualisationTimeRangeSelected,
  changeRunnerTimeRangeSelected,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
  addFingerprintToSimulationsToRun,
  resetSimulationRunner,
  failRun,
  addImportedSimRunResults,
} = simulationRunnerSlice.actions;

export default simulationRunnerSlice.reducer;
