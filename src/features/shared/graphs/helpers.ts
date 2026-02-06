import { TimeSeriesData } from '../../../models';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';

const THREE_MONTHS = 7776000000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toUnixMs = (unixTime: number): number =>
  unixTime < 10_000_000_000 ? unixTime * 1000 : unixTime;

const getUtcDayKey = (unixTime: number): number =>
  Math.floor(toUnixMs(unixTime) / DAY_IN_MS);

// if data range is less than THREE_MONTHS, returns everything
// else return the first data point of the day
export const getChartTimeSteps = (breakdown: SimulationRunBreakdown) => {
  if ((breakdown?.timeSteps?.length ?? 0) === 0) {
    return [];
  }
  const maxTime =
    toUnixMs(breakdown.timeSteps[breakdown.timeSteps.length - 1].unix) -
    toUnixMs(breakdown.timeSteps[0].unix);
  const { timeSteps: data } = breakdown;

  if (maxTime > THREE_MONTHS) {
    const filteredData: typeof data = [];
    let currentDayKey = -1;

    for (let i = 0; i < data.length; i++) {
      const dayKey = getUtcDayKey(data[i].unix);
      if (i === 0 || dayKey !== currentDayKey) {
        filteredData.push(data[i]);
        currentDayKey = dayKey;
      }
    }
    return filteredData;
  }

  return data;
};

// if data range is less than THREE_MONTHS, returns everything
// else return the first data point of the day
export const getChartTimeStepsFromProduct = (timeSeries: TimeSeriesData[]) => {
  if (timeSeries.length === 0) {
    return [];
  }
  const maxTime =
    toUnixMs(timeSeries[timeSeries.length - 1].timestamp) -
    toUnixMs(timeSeries[0].timestamp);

  if (maxTime > THREE_MONTHS) {
    const filteredData: TimeSeriesData[] = [];
    let currentDayKey = -1;

    for (let i = 0; i < timeSeries.length; i++) {
      const dayKey = getUtcDayKey(timeSeries[i].timestamp);
      if (i === 0 || dayKey !== currentDayKey) {
        filteredData.push(timeSeries[i]);
        currentDayKey = dayKey;
      }
    }
    return filteredData;
  }

  return timeSeries;
};

export const MAX_SCORE = 5;

export const getScoreColor = (value: number) => {
  if (value <= 1) {
    return 'rgba(166, 0, 0, 0.9)';
  } else if (value <= 2) {
    return 'rgba(250, 174, 42, 0.9)';
  } else if (value <= 3) {
    return 'rgba(255, 236, 64, 0.9)';
  }

  return 'rgba(2, 189, 46, 0.9)';
};

export const MAX_TOTAL_SCORE = 25;

export const getTotalScoreColor = (value: number) => {
  if (value <= 8) {
    return 'rgba(166, 0, 0, 0.7)';
  } else if (value <= 12) {
    return 'rgba(250, 174, 42, 0.7)';
  } else if (value <= 16) {
    return 'rgba(255, 236, 64, 0.7)';
  }

  return 'rgba(2, 189, 46, 0.7)';
};

export const getTotalScore = (data: number[]) => {
  return data.reduce((total: number, next: number) => (total += next), 0);
};
