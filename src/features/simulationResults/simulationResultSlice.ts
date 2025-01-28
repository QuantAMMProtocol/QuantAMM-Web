import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SimulationRunBreakdown } from './simulationResultSummaryModels';
export interface SimulationResults {
  breakdowns: SimulationRunBreakdown[];
  selectedBreakdowns: SimulationRunBreakdown[];
}

const initialState: SimulationResults = {
  breakdowns: [],
  selectedBreakdowns: [],
};

export function cloneBreakdown(
  origBreakdown: SimulationRunBreakdown
): SimulationRunBreakdown {
  return {
    simulationRun: origBreakdown.simulationRun,
    timeRange: {
      startDate: origBreakdown.timeRange.startDate,
      endDate: origBreakdown.timeRange.endDate,
      name: origBreakdown.timeRange.name,
    },
    simulationRunStatus: origBreakdown.simulationRunStatus,
    simulationComplete: origBreakdown.simulationComplete,
    flatSimulationRunResult: origBreakdown.flatSimulationRunResult,
    simulationRunResultAnalysis: origBreakdown.simulationRunResultAnalysis,
    timeSteps: [...origBreakdown.timeSteps],
  };
}

export const simulationResultSlice = createSlice({
  name: 'simulationResultSlice',
  initialState: initialState,
  reducers: {
    addRunResult: (state, action: PayloadAction<SimulationRunBreakdown>) => {
      const current = state.breakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.simulationRun.id &&
          x.timeRange.name == action.payload.timeRange.name
      );
      if (current == undefined) {
        state.breakdowns.push(cloneBreakdown(action.payload));
      }
    },
    removeRunResult: (state, action: PayloadAction<SimulationRunBreakdown>) => {
      const current = state.breakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.simulationRun.id &&
          x.timeRange.name == action.payload.timeRange.name
      );
      if (current != undefined) {
        state.breakdowns = state.breakdowns.filter(
          (x) =>
            !(
              x.simulationRun.id == action.payload.simulationRun.id &&
              x.timeRange.name == action.payload.timeRange.name
            )
        );
        state.selectedBreakdowns = state.selectedBreakdowns.filter(
          (x) =>
            !(
              x.simulationRun.id == action.payload.simulationRun.id &&
              x.timeRange.name == action.payload.timeRange.name
            )
        );
      }
    },
    selectBreakdownResult: (
      state,
      action: PayloadAction<SimulationRunBreakdown>
    ) => {
      const current = state.selectedBreakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.simulationRun.id &&
          x.timeRange.name == action.payload.timeRange.name
      );
      if (current == undefined) {
        state.selectedBreakdowns.push(action.payload);
      }
    },
    deselectBreakdownResult: (
      state,
      action: PayloadAction<SimulationRunBreakdown>
    ) => {
      const current = state.selectedBreakdowns.find(
        (x) =>
          x.simulationRun.id == action.payload.simulationRun.id &&
          x.timeRange.name == action.payload.timeRange.name
      );
      if (current != undefined) {
        state.selectedBreakdowns = state.selectedBreakdowns.filter(
          (x) =>
            !(
              x.simulationRun.id == action.payload.simulationRun.id &&
              x.timeRange.name == action.payload.timeRange.name
            )
        );
      }
    },
  },
});

export const selectSimulationResults = (state: RootState) =>
  state.simResults.breakdowns;
export const selectSelectedSimulationResults = (state: RootState) =>
  state.simResults.selectedBreakdowns;

export const {
  addRunResult,
  selectBreakdownResult,
  removeRunResult,
  deselectBreakdownResult,
} = simulationResultSlice.actions;

export default simulationResultSlice.reducer;
