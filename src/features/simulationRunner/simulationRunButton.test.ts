import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import { ConfigInitialState } from '../simulationRunConfiguration/simulationRunConfigurationInitialState';
import simulationRunnerReducer from './simulationRunnerSlice';
import {
  createRunSimulationsThunk,
  getFailureMessage,
} from './simulationRunButtonLogic';
import simulationRunConfigurationReducer from '../simulationRunConfiguration/simulationRunConfigurationSlice';

const makePool = () => ({
  ...ConfigInitialState.initialLiquidityPool,
  id: 'pool-1',
  updateRule: {
    ...ConfigInitialState.initialLiquidityPool.updateRule,
    updateRuleRunUrl: 'run-sim',
  },
  poolConstituents: ConfigInitialState.initialLiquidityPool.poolConstituents.map(
    (constituent) => ({
      ...constituent,
      coin: constituent.coin,
    })
  ),
  feeHooks: [],
  swapImports: [],
});

const makeState = () => {
  const pool = makePool();
  const simConfig = simulationRunConfigurationReducer(undefined, {
    type: '@@INIT',
  });
  const simRunner = simulationRunnerReducer(undefined, { type: '@@INIT' });

  return {
    simConfig: {
      ...simConfig,
      startDate: '2024-01-01 00:00:00',
      endDate: '2024-01-02 00:00:00',
      simulationLiquidityPools: [pool],
      gasPriceImport: [],
    },
    simRunner: {
      ...simRunner,
      simulationRunStatus: 'Pending',
      runTimePeriodRanges: [
        {
          name: 'custom',
          startDate: '2024-01-01 00:00:00',
          endDate: '2024-01-02 00:00:00',
        },
      ],
      simulationsToRun: [pool],
    },
  };
};

describe('simulationRunButton view-model logic', () => {
  it('extracts a failure message from error payloads', () => {
    expect(
      getFailureMessage({
        status: 500,
        data: 'from-data',
      } as any)
    ).toBe('from-data');
    expect(
      getFailureMessage({
        status: 500,
        error: 'from-error',
      } as any)
    ).toBe('from-error');
    expect(getFailureMessage({ status: 500 } as any)).toBe('Simulation failed');
  });

  it('runs a simulation thunk and dispatches success lifecycle actions', async () => {
    const state = makeState();
    const store = configureStore({
      reducer: {
        simConfig: simulationRunConfigurationReducer,
        simRunner: simulationRunnerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: state as any,
    });

    const runSimulation = vi.fn().mockResolvedValue({
      data: {
        timeSteps: [],
        analysis: {
          return_analysis: [],
          benchmark_analysis: [],
          return_timeseries_analysis: [],
          final_weights: [],
          final_weights_strings: [],
          final_unix_timestamp: 0,
          jax_parameters: {},
          smart_contract_parameters: { values: {}, strings: {} },
          readouts: { values: {}, strings: {} },
        },
      },
    });
    const convertResponse = vi.fn().mockReturnValue({
      results: [],
      analysisResults: {
        return_analysis: [],
        benchmark_analysis: [],
        return_timeseries_analysis: [],
        final_weights: [],
        final_weights_strings: [],
        final_unix_timestamp: 0,
        jax_parameters: {},
        smart_contract_parameters: { values: {}, strings: {} },
        readouts: { values: {}, strings: {} },
      },
    });

    const thunk = createRunSimulationsThunk({
      runTimeRange: 'custom',
      runSimulation,
      convertResponse,
    });

    await store.dispatch(thunk as any);

    const simRunnerState = store.getState().simRunner;

    expect(runSimulation).toHaveBeenCalledTimes(1);
    expect(convertResponse).toHaveBeenCalledTimes(1);
    expect(simRunnerState.simulationRunStatus).toBe('Complete');
    expect(simRunnerState.simulationRunnerCurrentStepIndex).toBe(6);
    expect(simRunnerState.simulationRunBreakdowns).toHaveLength(1);
    expect(simRunnerState.simulationRunBreakdowns[0].simulationComplete).toBe(
      true
    );
    expect(simRunnerState.simulationRunBreakdowns[0].simulationRunStatus).toBe(
      'Complete'
    );
  });

  it('dispatches failRun when API response does not include data', async () => {
    const state = makeState();
    const store = configureStore({
      reducer: {
        simConfig: simulationRunConfigurationReducer,
        simRunner: simulationRunnerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: state as any,
    });
    const runSimulation = vi.fn().mockResolvedValue({
      error: {
        status: 500,
        error: 'backend exploded',
      },
    });

    const thunk = createRunSimulationsThunk({
      runTimeRange: 'custom',
      runSimulation,
      convertResponse: vi.fn(),
    });

    await store.dispatch(thunk as any);

    const simRunnerState = store.getState().simRunner;
    expect(simRunnerState.simulationRunStatus).toBe('Complete');
    expect(simRunnerState.simulationRunBreakdowns[0].simulationRunStatus).toBe(
      'backend exploded'
    );
  });

  it('does not start a new run when status is not Pending', async () => {
    const state = makeState();
    const store = configureStore({
      reducer: {
        simConfig: simulationRunConfigurationReducer,
        simRunner: simulationRunnerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: {
        ...state,
        simRunner: {
          ...state.simRunner,
          simulationRunStatus: 'Running',
        },
      } as any,
    });

    const runSimulation = vi.fn();
    const convertResponse = vi.fn();
    const thunk = createRunSimulationsThunk({
      runTimeRange: 'custom',
      runSimulation,
      convertResponse,
    });

    await store.dispatch(thunk as any);

    expect(runSimulation).not.toHaveBeenCalled();
    expect(convertResponse).not.toHaveBeenCalled();
    expect(store.getState().simRunner.simulationRunStatus).toBe('Running');
    expect(store.getState().simRunner.simulationRunBreakdowns).toHaveLength(0);
  });
});
