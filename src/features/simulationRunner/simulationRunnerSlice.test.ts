import { describe, expect, it } from 'vitest';
import {
  completeRun,
  failRun,
  getSimulationRunStatusIndex,
  initializeTimeRangeToRun,
  updateProgressPercent,
  updateStatus,
} from './simulationRunnerSlice';
import simulationRunnerReducer from './simulationRunnerSlice';
import { ConfigInitialState } from '../simulationRunConfiguration/simulationRunConfigurationInitialState';
import { LiquidityPool } from '../simulationRunConfiguration/simulationRunConfigModels';
import { SimulationRunBreakdown } from '../simulationResults/simulationResultSummaryModels';

const createPool = (id: string): LiquidityPool => {
  const initialPool = ConfigInitialState.initialLiquidityPool;
  return {
    ...initialPool,
    id,
    name: `pool-${id}`,
    poolConstituents: initialPool.poolConstituents.map((constituent) => ({
      ...constituent,
      coin: constituent.coin,
    })),
    updateRule: {
      ...initialPool.updateRule,
      updateRuleParameters: initialPool.updateRule.updateRuleParameters.map(
        (parameter) => ({
          ...parameter,
          applicableCoins: [...parameter.applicableCoins],
        })
      ),
    },
    feeHooks: [...initialPool.feeHooks],
    swapImports: [...initialPool.swapImports],
    poolType: { ...initialPool.poolType },
  };
};

const createBreakdown = (
  pool: LiquidityPool,
  complete: boolean
): SimulationRunBreakdown => ({
  simulationRun: pool,
  flatSimulationRunResult: undefined,
  simulationRunStatus: complete ? 'Complete' : 'running',
  simulationComplete: complete,
  timeSteps: [],
  timeRange: {
    name: 'custom',
    startDate: '2024-01-01 00:00:00',
    endDate: '2024-01-02 00:00:00',
  },
  simulationRunResultAnalysis: undefined,
});

describe('simulationRunnerSlice view-model logic', () => {
  it('maps run status to expected step indexes', () => {
    expect(getSimulationRunStatusIndex('Pending', [])).toBe(0);
    expect(getSimulationRunStatusIndex('Running', [])).toBe(1);
    expect(
      getSimulationRunStatusIndex('Complete', [
        createBreakdown(createPool('1'), true),
      ])
    ).toBe(2);
    expect(
      getSimulationRunStatusIndex('Complete', [
        createBreakdown(createPool('1'), true),
        createBreakdown(createPool('2'), false),
      ])
    ).toBe(-1);
  });

  it('updates status and only advances step index for positive mapped statuses', () => {
    const baseState = simulationRunnerReducer(undefined, { type: '@@INIT' });

    const runningState = simulationRunnerReducer(baseState, updateStatus('Running'));
    const pendingState = simulationRunnerReducer(runningState, updateStatus('Pending'));

    expect(runningState.simulationRunStatus).toBe('Running');
    expect(runningState.simulationRunStatusStepIndex).toBe(1);
    expect(pendingState.simulationRunStatusStepIndex).toBe(1);
  });

  it('computes progress percentage from completed breakdowns', () => {
    const poolA = createPool('a');
    const poolB = createPool('b');
    const poolC = createPool('c');
    const baseState = simulationRunnerReducer(undefined, { type: '@@INIT' });
    const seededState = {
      ...baseState,
      simulationsToRun: [poolA, poolB, poolC],
      simulationRunBreakdowns: [
        createBreakdown(poolA, true),
        createBreakdown(poolB, false),
        createBreakdown(poolC, true),
      ],
    };

    const nextState = simulationRunnerReducer(seededState, updateProgressPercent());

    expect(nextState.simulationRunProgressPercent).toBeCloseTo(66.6666, 3);
  });

  it('initializes custom time range when custom mode is selected', () => {
    const baseState = simulationRunnerReducer(undefined, { type: '@@INIT' });

    const nextState = simulationRunnerReducer(
      baseState,
      initializeTimeRangeToRun({
        name: 'custom',
        custStartDate: '2024-01-01 00:00:00',
        custEndDate: '2024-02-01 00:00:00',
      })
    );

    expect(nextState.runTimePeriodRanges).toEqual([
      {
        name: 'custom',
        startDate: '2024-01-01 00:00:00',
        endDate: '2024-02-01 00:00:00',
      },
    ]);
  });

  it('resets to preset time ranges for non-custom selections', () => {
    const baseState = simulationRunnerReducer(undefined, { type: '@@INIT' });

    const nextState = simulationRunnerReducer(
      {
        ...baseState,
        runTimePeriodRanges: [
          {
            name: 'custom',
            startDate: '2024-01-01 00:00:00',
            endDate: '2024-02-01 00:00:00',
          },
        ],
        simulationResultTimeRangeSelection: 'custom',
      },
      initializeTimeRangeToRun({
        name: 'super cycle',
        custStartDate: '2024-01-01 00:00:00',
        custEndDate: '2024-02-01 00:00:00',
      })
    );

    expect(nextState.runTimePeriodRanges).toEqual(baseState.runTimePeriodRanges);
    expect(nextState.simulationResultTimeRangeSelection).toBe(
      baseState.runTimePeriodRanges[0].name
    );
  });

  it('marks targeted runs complete and records failure messages', () => {
    const pool = createPool('target');
    const baseState = simulationRunnerReducer(undefined, { type: '@@INIT' });
    const seededState = {
      ...baseState,
      simulationRunBreakdowns: [createBreakdown(pool, false)],
    };

    const completedState = simulationRunnerReducer(
      seededState,
      completeRun({ id: 'target', timeRangeName: 'custom' })
    );
    expect(completedState.simulationRunBreakdowns[0].simulationComplete).toBe(true);
    expect(completedState.simulationRunBreakdowns[0].simulationRunStatus).toBe(
      'Complete'
    );

    const failedState = simulationRunnerReducer(
      seededState,
      failRun({
        id: 'target',
        timeRangeName: 'custom',
        errorMessage: 'backend timeout',
      })
    );
    expect(failedState.simulationRunBreakdowns[0].simulationComplete).toBe(true);
    expect(failedState.simulationRunBreakdowns[0].simulationRunStatus).toBe(
      'backend timeout'
    );
  });
});
