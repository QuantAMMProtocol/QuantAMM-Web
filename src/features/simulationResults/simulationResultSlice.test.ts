import { describe, expect, it } from 'vitest';
import {
  addRunResult,
  cloneBreakdown,
  deselectBreakdownResult,
  removeRunResult,
  selectBreakdownResult,
} from './simulationResultSlice';
import simulationResultReducer from './simulationResultSlice';
import { SimulationRunBreakdown } from './simulationResultSummaryModels';

const createBreakdown = (
  id: string,
  rangeName = 'custom'
): SimulationRunBreakdown =>
  ({
    simulationRun: { id },
    flatSimulationRunResult: undefined,
    simulationRunStatus: 'running',
    simulationComplete: false,
    timeSteps: [{ unix: 1704067200 }],
    timeRange: {
      name: rangeName,
      startDate: '2024-01-01 00:00:00',
      endDate: '2024-01-02 00:00:00',
    },
    simulationRunResultAnalysis: undefined,
  }) as unknown as SimulationRunBreakdown;

describe('simulationResultSlice view-model logic', () => {
  it('clones timeRange and timeSteps containers when adding a breakdown', () => {
    const original = createBreakdown('pool-a');
    const cloned = cloneBreakdown(original);

    expect(cloned).not.toBe(original);
    expect(cloned.timeRange).not.toBe(original.timeRange);
    expect(cloned.timeSteps).not.toBe(original.timeSteps);

    original.timeSteps.push({ unix: 1704153600 } as any);
    expect(cloned.timeSteps).toHaveLength(1);
  });

  it('adds unique run results and skips duplicates with same id + time range', () => {
    const baseState = simulationResultReducer(undefined, { type: '@@INIT' });
    const breakdown = createBreakdown('pool-a', '1m');

    const onceAdded = simulationResultReducer(baseState, addRunResult(breakdown));
    const twiceAdded = simulationResultReducer(onceAdded, addRunResult(breakdown));

    expect(onceAdded.breakdowns).toHaveLength(1);
    expect(twiceAdded.breakdowns).toHaveLength(1);
  });

  it('removes a breakdown from both stored and selected collections', () => {
    const baseState = simulationResultReducer(undefined, { type: '@@INIT' });
    const breakdown = createBreakdown('pool-a', '1y');
    const anotherBreakdown = createBreakdown('pool-b', '1y');

    const seededState = {
      ...baseState,
      breakdowns: [breakdown, anotherBreakdown],
      selectedBreakdowns: [breakdown],
    };

    const nextState = simulationResultReducer(
      seededState,
      removeRunResult(breakdown)
    );

    expect(nextState.breakdowns).toEqual([anotherBreakdown]);
    expect(nextState.selectedBreakdowns).toEqual([]);
  });

  it('selects and deselects breakdowns without duplicates', () => {
    const baseState = simulationResultReducer(undefined, { type: '@@INIT' });
    const breakdown = createBreakdown('pool-c', 'max');

    const selectedOnce = simulationResultReducer(
      baseState,
      selectBreakdownResult(breakdown)
    );
    const selectedTwice = simulationResultReducer(
      selectedOnce,
      selectBreakdownResult(breakdown)
    );
    const deselected = simulationResultReducer(
      selectedTwice,
      deselectBreakdownResult(breakdown)
    );

    expect(selectedOnce.selectedBreakdowns).toHaveLength(1);
    expect(selectedTwice.selectedBreakdowns).toHaveLength(1);
    expect(deselected.selectedBreakdowns).toHaveLength(0);
  });
});
