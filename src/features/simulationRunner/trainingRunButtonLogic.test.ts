import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import simulationRunConfigurationReducer from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import simulationRunnerReducer from './simulationRunnerSlice';
import { createRunTrainingThunk } from './trainingRunButtonLogic';

const makeState = () => {
  const simConfig = simulationRunConfigurationReducer(undefined, {
    type: '@@INIT',
  });
  const simRunner = simulationRunnerReducer(undefined, { type: '@@INIT' });

  const firstPool = {
    ...simConfig.initialLiquidityPool,
    id: 'train-pool-1',
    updateRule: {
      ...simConfig.initialLiquidityPool.updateRule,
      updateRuleTrainUrl: 'runTraining',
    },
  };

  return {
    simConfig: {
      ...simConfig,
      startDate: '2024-01-01 00:00:00',
      endDate: '2024-02-01 00:00:00',
      simulationLiquidityPools: [firstPool],
    },
    simRunner,
  };
};

describe('trainingRunButtonLogic', () => {
  it('starts and stores active training run metadata from kickoff response', async () => {
    const store = configureStore({
      reducer: {
        simConfig: simulationRunConfigurationReducer,
        simRunner: simulationRunnerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: makeState() as any,
    });

    const runTraining = vi.fn().mockResolvedValue({
      data: {
        runId: 'run-abc',
        runLocation: './results/run-abc.json',
        status: 'running',
        latestStep: 2,
        totalSteps: 20,
        latestObjective: 0.45,
      },
    });

    await store.dispatch(
      createRunTrainingThunk({
        runTraining,
      }) as any
    );

    const simRunnerState = store.getState().simRunner;
    expect(runTraining).toHaveBeenCalledTimes(1);
    expect(simRunnerState.trainingRunStatus).toBe('Running');
    expect(simRunnerState.activeTrainingRunId).toBe('run-abc');
    expect(simRunnerState.activeTrainingRunLocation).toBe(
      './results/run-abc.json'
    );
    expect(simRunnerState.trainingLatestStep).toBe(2);
    expect(simRunnerState.trainingTotalSteps).toBe(20);
    expect(simRunnerState.trainingLatestObjective).toBe(0.45);
  });

  it('marks training as failed when no pools are configured', async () => {
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
        simConfig: {
          ...state.simConfig,
          simulationLiquidityPools: [],
        },
      } as any,
    });

    const runTraining = vi.fn();

    await store.dispatch(
      createRunTrainingThunk({
        runTraining,
      }) as any
    );

    const simRunnerState = store.getState().simRunner;
    expect(runTraining).not.toHaveBeenCalled();
    expect(simRunnerState.trainingRunStatus).toBe('Failed');
    expect(simRunnerState.trainingErrorMessage).toContain(
      'No pools configured'
    );
  });

  it('marks training as failed when runTraining returns an RTK query error payload', async () => {
    const store = configureStore({
      reducer: {
        simConfig: simulationRunConfigurationReducer,
        simRunner: simulationRunnerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: makeState() as any,
    });

    const runTraining = vi.fn().mockResolvedValue({
      error: {
        status: 500,
        data: {
          message: 'Backend training endpoint failed',
        },
      },
    });

    await store.dispatch(
      createRunTrainingThunk({
        runTraining,
      }) as any
    );

    const simRunnerState = store.getState().simRunner;
    expect(runTraining).toHaveBeenCalledTimes(1);
    expect(simRunnerState.trainingRunStatus).toBe('Failed');
    expect(simRunnerState.trainingErrorMessage).toContain(
      'Backend training endpoint failed'
    );
  });

  it('supports a stubbed UX failure mode when filename is set to stub-fail', async () => {
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
        simConfig: {
          ...state.simConfig,
          trainingParameters: {
            trainingParameters:
              state.simConfig.trainingParameters.trainingParameters.map(
                (parameter) =>
                  parameter.name === 'filename'
                    ? { ...parameter, value: 'stub-fail' }
                    : parameter
              ),
          },
        },
      } as any,
    });

    const runTraining = vi.fn();

    await store.dispatch(
      createRunTrainingThunk({
        runTraining,
      }) as any
    );

    const simRunnerState = store.getState().simRunner;
    expect(runTraining).not.toHaveBeenCalled();
    expect(simRunnerState.trainingRunStatus).toBe('Failed');
    expect(simRunnerState.trainingErrorMessage).toContain(
      'Stubbed training failure for UX testing'
    );
  });
});
