import { AppThunk, RootState } from '../../app/store';
import {
  completeTrainingRun,
  failTrainingRun,
  startTrainingRun,
  updateTrainingRunProgress,
} from './simulationRunnerSlice';
import {
  ConvertToLiquidityPoolDto,
  TrainingDto,
} from './simulationRunnerDtos';
import { LiquidityPool } from '../simulationRunConfiguration/simulationRunConfigModels';

export type RunTrainingInvoker = (payload: {
  url: string;
  trainingDto: TrainingDto;
}) => Promise<unknown>;

export type RetrieveTrainingInvoker = (payload: {
  url: string;
  trainingDto: TrainingDto;
}) => Promise<unknown>;

const DEFAULT_RETRIEVE_TRAINING_URL = 'retrieveTraining';

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function coerceString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function normaliseStatus(
  status: unknown
): 'Pending' | 'Running' | 'Complete' | 'Failed' {
  const value = coerceString(status).toLowerCase();

  if (
    value === 'complete' ||
    value === 'completed' ||
    value === 'done' ||
    value === 'success'
  ) {
    return 'Complete';
  }

  if (
    value === 'failed' ||
    value === 'error' ||
    value === 'errored' ||
    value === 'failure'
  ) {
    return 'Failed';
  }

  if (
    value === 'running' ||
    value === 'in_progress' ||
    value === 'in progress' ||
    value === 'started' ||
    value === 'processing'
  ) {
    return 'Running';
  }

  return 'Pending';
}

function parseResponse(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') {
    try {
      return asRecord(JSON.parse(value));
    } catch {
      return {};
    }
  }

  const potentialWrappedData = asRecord(value);
  const potentialData = potentialWrappedData.data;

  if (potentialData) {
    const parsedData = asRecord(potentialData);
    if (typeof parsedData.value === 'string') {
      try {
        return asRecord(JSON.parse(parsedData.value));
      } catch {
        return parsedData;
      }
    }
    return parsedData;
  }

  if (typeof potentialWrappedData.value === 'string') {
    try {
      return asRecord(JSON.parse(potentialWrappedData.value));
    } catch {
      return potentialWrappedData;
    }
  }

  return potentialWrappedData;
}

function getTrainingFilename(state: RootState, fallback: string): string {
  const filenameParam = state.simConfig.trainingParameters.trainingParameters.find(
    (parameter) => parameter.name === 'filename'
  );
  const filename = filenameParam?.value?.trim();
  if (filename) {
    return filename;
  }

  return fallback;
}

export function buildTrainingRunDto(
  state: RootState,
  pool: LiquidityPool,
  trainingRunFilename: string
): TrainingDto {
  return {
    trainingRunFilename,
    trainingParameters: state.simConfig.trainingParameters,
    pool: ConvertToLiquidityPoolDto(pool),
    startUnix: new Date(state.simConfig.startDate).getTime(),
    endUnix: new Date(state.simConfig.endDate).getTime(),
  };
}

function resolveLatestStep(response: Record<string, unknown>): number | undefined {
  return (
    coerceNumber(response.latestStep) ??
    coerceNumber(response.currentStep) ??
    coerceNumber(response.step)
  );
}

function resolveTotalSteps(
  response: Record<string, unknown>,
  fallbackIterations: number
): number {
  return (
    coerceNumber(response.totalSteps) ??
    coerceNumber(response.stepsTotal) ??
    coerceNumber(response.nIterations) ??
    fallbackIterations
  );
}

function resolveLatestObjective(
  response: Record<string, unknown>
): number | null | undefined {
  return (
    coerceNumber(response.latestObjective) ??
    coerceNumber(response.objective) ??
    coerceNumber(response.lastObjective)
  );
}

function getIterationFallback(state: RootState): number {
  const nIterations = state.simConfig.trainingParameters.trainingParameters.find(
    (parameter) => parameter.name === 'n_iterations'
  );

  return coerceNumber(nIterations?.value) ?? 0;
}

export const createRunTrainingThunk = ({
  runTraining,
}: {
  runTraining: RunTrainingInvoker;
}): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const state = getState();
    const configuredPools = state.simConfig.simulationLiquidityPools;

    if (configuredPools.length === 0) {
      dispatch(
        failTrainingRun({
          errorMessage:
            'No pools configured. Add a pool before starting Train BTF.',
          finishedAtIso: new Date().toISOString(),
        })
      );
      return;
    }

    const targetPool = configuredPools[0];

    if (!targetPool.updateRule.updateRuleTrainUrl) {
      dispatch(
        failTrainingRun({
          errorMessage:
            'Selected update rule does not expose a training endpoint.',
          finishedAtIso: new Date().toISOString(),
        })
      );
      return;
    }

    const nowIso = new Date().toISOString();
    const requestedFilename = getTrainingFilename(state, `train-btf-${Date.now()}`);
    const kickoffDto = buildTrainingRunDto(state, targetPool, requestedFilename);

    try {
      const rawResponse = await runTraining({
        url: targetPool.updateRule.updateRuleTrainUrl,
        trainingDto: kickoffDto,
      });

      const response = parseResponse(rawResponse);
      const runId =
        coerceString(response.runId) ||
        coerceString(response.trainingRunId) ||
        coerceString(response.id) ||
        requestedFilename;
      const runLocation =
        coerceString(response.runLocation) ||
        coerceString(response.run_location) ||
        coerceString(response.resultFile) ||
        coerceString(response.result_file) ||
        '';

      dispatch(
        startTrainingRun({
          runId,
          runLocation,
          startedAtIso: nowIso,
        })
      );

      const status = normaliseStatus(response.status);
      const iterationFallback = getIterationFallback(getState());
      const latestStep = resolveLatestStep(response);
      const totalSteps = resolveTotalSteps(response, iterationFallback);
      const latestObjective = resolveLatestObjective(response);
      const updatedAtIso = new Date().toISOString();

      if (status === 'Complete') {
        dispatch(
          completeTrainingRun({
            finishedAtIso: updatedAtIso,
            latestStep,
            totalSteps,
            latestObjective,
          })
        );
        return;
      }

      if (status === 'Failed') {
        dispatch(
          failTrainingRun({
            errorMessage:
              coerceString(response.errorMessage) ||
              coerceString(response.error) ||
              'Training run failed.',
            finishedAtIso: updatedAtIso,
          })
        );
        return;
      }

      dispatch(
        updateTrainingRunProgress({
          status: 'Running',
          latestStep,
          totalSteps,
          latestObjective,
          runLocation,
          updatedAtIso,
        })
      );
    } catch (error) {
      dispatch(
        failTrainingRun({
          errorMessage:
            error instanceof Error
              ? error.message
              : 'Failed to start training run.',
          finishedAtIso: new Date().toISOString(),
        })
      );
    }
  };
};

export const createPollTrainingProgressThunk = ({
  retrieveTraining,
  retrieveUrl = DEFAULT_RETRIEVE_TRAINING_URL,
}: {
  retrieveTraining: RetrieveTrainingInvoker;
  retrieveUrl?: string;
}): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const state = getState();
    const activeRunId = state.simRunner.activeTrainingRunId;
    const configuredPools = state.simConfig.simulationLiquidityPools;

    if (!activeRunId || configuredPools.length === 0) {
      return;
    }

    const targetPool = configuredPools[0];
    const pollingDto = buildTrainingRunDto(state, targetPool, activeRunId);

    try {
      const rawResponse = await retrieveTraining({
        url: retrieveUrl,
        trainingDto: pollingDto,
      });
      const response = parseResponse(rawResponse);
      const status = normaliseStatus(response.status);
      const latestStep = resolveLatestStep(response);
      const totalSteps = resolveTotalSteps(response, getIterationFallback(state));
      const latestObjective = resolveLatestObjective(response);
      const updatedAtIso = new Date().toISOString();

      dispatch(
        updateTrainingRunProgress({
          status,
          latestStep,
          totalSteps,
          latestObjective,
          runLocation:
            coerceString(response.runLocation) ||
            coerceString(response.run_location),
          updatedAtIso,
        })
      );

      if (status === 'Complete') {
        dispatch(
          completeTrainingRun({
            finishedAtIso: updatedAtIso,
            latestStep,
            totalSteps,
            latestObjective,
          })
        );
      } else if (status === 'Failed') {
        dispatch(
          failTrainingRun({
            errorMessage:
              coerceString(response.errorMessage) ||
              coerceString(response.error) ||
              'Training run failed.',
            finishedAtIso: updatedAtIso,
          })
        );
      }
    } catch (error) {
      // Polling is best-effort. Keep the run active on transient failures.
      console.error('Training polling failed:', error);
    }
  };
};
