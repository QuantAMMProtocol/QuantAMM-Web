import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SimulationRunner, TrainingRunSummary } from './simulationRunnerModels';
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
  trainingRunStatus: 'Pending',
  activeTrainingRunId: '',
  activeTrainingRunLocation: '',
  trainingLatestStep: 0,
  trainingTotalSteps: 0,
  trainingLatestObjective: null,
  trainingLastUpdatedAtIso: '',
  trainingErrorMessage: '',
  trainingRunHistory: [],
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

function upsertTrainingHistory(
  state: SimulationRunner,
  summary: TrainingRunSummary
) {
  const existingIndex = state.trainingRunHistory.findIndex(
    (run) => run.runId === summary.runId
  );

  if (existingIndex === -1) {
    state.trainingRunHistory.unshift(summary);
    return;
  }

  state.trainingRunHistory[existingIndex] = summary;
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
    startTrainingRun: (
      state,
      action: PayloadAction<{
        runId: string;
        runLocation: string;
        startedAtIso: string;
      }>
    ) => {
      state.trainingRunStatus = 'Running';
      state.activeTrainingRunId = action.payload.runId;
      state.activeTrainingRunLocation = action.payload.runLocation;
      state.trainingLatestStep = 0;
      state.trainingTotalSteps = 0;
      state.trainingLatestObjective = null;
      state.trainingLastUpdatedAtIso = action.payload.startedAtIso;
      state.trainingErrorMessage = '';

      upsertTrainingHistory(state, {
        runId: action.payload.runId,
        runLocation: action.payload.runLocation,
        status: 'Running',
        startedAtIso: action.payload.startedAtIso,
      });
    },
    updateTrainingRunProgress: (
      state,
      action: PayloadAction<{
        status?: 'Pending' | 'Running' | 'Complete' | 'Failed';
        latestStep?: number;
        totalSteps?: number;
        latestObjective?: number | null;
        updatedAtIso: string;
        runLocation?: string;
      }>
    ) => {
      state.trainingRunStatus = action.payload.status ?? state.trainingRunStatus;
      if (action.payload.latestStep !== undefined) {
        state.trainingLatestStep = action.payload.latestStep;
      }
      if (action.payload.totalSteps !== undefined) {
        state.trainingTotalSteps = action.payload.totalSteps;
      }
      if (action.payload.latestObjective !== undefined) {
        state.trainingLatestObjective = action.payload.latestObjective;
      }
      if (action.payload.runLocation) {
        state.activeTrainingRunLocation = action.payload.runLocation;
      }

      state.trainingLastUpdatedAtIso = action.payload.updatedAtIso;

      if (!state.activeTrainingRunId) {
        return;
      }

      const currentHistoryEntry =
        state.trainingRunHistory.find(
          (run) => run.runId === state.activeTrainingRunId
        ) ?? null;

      upsertTrainingHistory(state, {
        runId: state.activeTrainingRunId,
        runLocation:
          action.payload.runLocation ??
          currentHistoryEntry?.runLocation ??
          state.activeTrainingRunLocation,
        status: action.payload.status ?? currentHistoryEntry?.status ?? 'Running',
        startedAtIso:
          currentHistoryEntry?.startedAtIso ?? action.payload.updatedAtIso,
        finishedAtIso:
          action.payload.status === 'Complete' || action.payload.status === 'Failed'
            ? action.payload.updatedAtIso
            : currentHistoryEntry?.finishedAtIso,
        latestStep:
          action.payload.latestStep ?? currentHistoryEntry?.latestStep,
        totalSteps:
          action.payload.totalSteps ?? currentHistoryEntry?.totalSteps,
        latestObjective:
          action.payload.latestObjective ?? currentHistoryEntry?.latestObjective,
        errorMessage: currentHistoryEntry?.errorMessage,
      });
    },
    completeTrainingRun: (
      state,
      action: PayloadAction<{
        finishedAtIso: string;
        latestStep?: number;
        totalSteps?: number;
        latestObjective?: number | null;
      }>
    ) => {
      state.trainingRunStatus = 'Complete';
      state.trainingLastUpdatedAtIso = action.payload.finishedAtIso;
      state.trainingErrorMessage = '';

      if (action.payload.latestStep !== undefined) {
        state.trainingLatestStep = action.payload.latestStep;
      }
      if (action.payload.totalSteps !== undefined) {
        state.trainingTotalSteps = action.payload.totalSteps;
      }
      if (action.payload.latestObjective !== undefined) {
        state.trainingLatestObjective = action.payload.latestObjective;
      }

      if (!state.activeTrainingRunId) {
        return;
      }

      const currentHistoryEntry =
        state.trainingRunHistory.find(
          (run) => run.runId === state.activeTrainingRunId
        ) ?? null;

      upsertTrainingHistory(state, {
        runId: state.activeTrainingRunId,
        runLocation:
          currentHistoryEntry?.runLocation ?? state.activeTrainingRunLocation,
        status: 'Complete',
        startedAtIso:
          currentHistoryEntry?.startedAtIso ?? action.payload.finishedAtIso,
        finishedAtIso: action.payload.finishedAtIso,
        latestStep: action.payload.latestStep ?? currentHistoryEntry?.latestStep,
        totalSteps: action.payload.totalSteps ?? currentHistoryEntry?.totalSteps,
        latestObjective:
          action.payload.latestObjective ?? currentHistoryEntry?.latestObjective,
        errorMessage: currentHistoryEntry?.errorMessage,
      });
    },
    failTrainingRun: (
      state,
      action: PayloadAction<{
        errorMessage: string;
        finishedAtIso: string;
      }>
    ) => {
      state.trainingRunStatus = 'Failed';
      state.trainingErrorMessage = action.payload.errorMessage;
      state.trainingLastUpdatedAtIso = action.payload.finishedAtIso;

      if (!state.activeTrainingRunId) {
        return;
      }

      const currentHistoryEntry =
        state.trainingRunHistory.find(
          (run) => run.runId === state.activeTrainingRunId
        ) ?? null;

      upsertTrainingHistory(state, {
        runId: state.activeTrainingRunId,
        runLocation:
          currentHistoryEntry?.runLocation ?? state.activeTrainingRunLocation,
        status: 'Failed',
        startedAtIso:
          currentHistoryEntry?.startedAtIso ?? action.payload.finishedAtIso,
        finishedAtIso: action.payload.finishedAtIso,
        latestStep: currentHistoryEntry?.latestStep,
        totalSteps: currentHistoryEntry?.totalSteps,
        latestObjective: currentHistoryEntry?.latestObjective,
        errorMessage: action.payload.errorMessage,
      });
    },
    resetTrainingWorkflow: (state) => {
      state.trainingRunStatus = 'Pending';
      state.activeTrainingRunId = '';
      state.activeTrainingRunLocation = '';
      state.trainingLatestStep = 0;
      state.trainingTotalSteps = 0;
      state.trainingLatestObjective = null;
      state.trainingLastUpdatedAtIso = '';
      state.trainingErrorMessage = '';
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
      state.trainingRunStatus = 'Pending';
      state.activeTrainingRunId = '';
      state.activeTrainingRunLocation = '';
      state.trainingLatestStep = 0;
      state.trainingTotalSteps = 0;
      state.trainingLatestObjective = null;
      state.trainingLastUpdatedAtIso = '';
      state.trainingErrorMessage = '';
      state.trainingRunHistory = [];
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
export const selectTrainingRunStatus = (state: RootState) =>
  state.simRunner.trainingRunStatus;
export const selectActiveTrainingRunId = (state: RootState) =>
  state.simRunner.activeTrainingRunId;
export const selectActiveTrainingRunLocation = (state: RootState) =>
  state.simRunner.activeTrainingRunLocation;
export const selectTrainingLatestStep = (state: RootState) =>
  state.simRunner.trainingLatestStep;
export const selectTrainingTotalSteps = (state: RootState) =>
  state.simRunner.trainingTotalSteps;
export const selectTrainingLatestObjective = (state: RootState) =>
  state.simRunner.trainingLatestObjective;
export const selectTrainingLastUpdatedAtIso = (state: RootState) =>
  state.simRunner.trainingLastUpdatedAtIso;
export const selectTrainingErrorMessage = (state: RootState) =>
  state.simRunner.trainingErrorMessage;
export const selectTrainingRunHistory = (state: RootState) =>
  state.simRunner.trainingRunHistory;

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
  startTrainingRun,
  updateTrainingRunProgress,
  completeTrainingRun,
  failTrainingRun,
  resetTrainingWorkflow,
  addFingerprintToSimulationsToRun,
  resetSimulationRunner,
  failRun,
  addImportedSimRunResults,
} = simulationRunnerSlice.actions;

export default simulationRunnerSlice.reducer;
