import { TimeSeriesData } from '../../../models';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';

const THREE_MONTHS = 7776000000;

// if data range is less than THREE_MONTHS, returns everything
// else return the first data point of the day
export const getChartTimeSteps = (breakdown: SimulationRunBreakdown) => {
  if ((breakdown?.timeSteps?.length ?? 0) === 0) {
    return [];
  }
  const maxTime =
    breakdown.timeSteps[breakdown.timeSteps.length - 1].unix -
    breakdown.timeSteps[0].unix;
  const { timeSteps: data } = breakdown;

  if (maxTime > THREE_MONTHS) {
    const filteredData = [];
    let currentDay = 0;

    for (let i = 0; i < data.length; i++) {
      const day = new Date(data[i].unix).getDay();
      if (i === 0 || day !== currentDay) {
        filteredData.push(data[i]);
        currentDay = day;
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
    timeSeries[timeSeries.length - 1].timestamp - timeSeries[0].timestamp;

  if (maxTime > THREE_MONTHS) {
    const filteredData = [];
    let currentDay = 0;

    for (let i = 0; i < timeSeries.length; i++) {
      const day = new Date(timeSeries[i].timestamp).getDay();
      if (i === 0 || day !== currentDay) {
        filteredData.push(timeSeries[i]);
        currentDay = day;
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
