import { describe, expect, it } from 'vitest';
import { TimeSeriesData } from '../../../models';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import {
  getChartTimeSteps,
  getChartTimeStepsFromProduct,
  getScoreColor,
  getTotalScore,
  getTotalScoreColor,
} from './helpers';

const createBreakdown = (unixTimes: number[]): SimulationRunBreakdown =>
  ({
    timeSteps: unixTimes.map((unix) => ({ unix })),
  }) as unknown as SimulationRunBreakdown;

const createTimeSeries = (timestamps: number[]): TimeSeriesData[] =>
  timestamps.map(
    (timestamp) =>
      ({
        timestamp,
      }) as TimeSeriesData
  );

describe('shared/graphs/helpers view-model logic', () => {
  it('returns full breakdown timesteps for ranges shorter than three months', () => {
    const breakdown = createBreakdown([1000, 2000, 3000]);
    expect(getChartTimeSteps(breakdown)).toHaveLength(3);
  });

  it('keeps first timestep per UTC day when range exceeds three months', () => {
    const dayMs = 24 * 60 * 60 * 1000;
    const start = Date.UTC(2024, 0, 1);
    const longRangeBreakdown = createBreakdown([
      start,
      start + 60 * 60 * 1000,
      start + 100 * dayMs,
      start + 100 * dayMs + 60 * 60 * 1000,
    ]);

    const filtered = getChartTimeSteps(longRangeBreakdown);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].unix).toBe(start);
    expect(filtered[1].unix).toBe(start + 100 * dayMs);
  });

  it('applies the same daily downsampling behavior for product time series', () => {
    const daySec = 24 * 60 * 60;
    const startSec = Math.floor(Date.UTC(2024, 0, 1) / 1000);
    const timeSeries = createTimeSeries([
      startSec,
      startSec + 3600,
      startSec + 100 * daySec,
      startSec + 100 * daySec + 3600,
    ]);

    const filtered = getChartTimeStepsFromProduct(timeSeries);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].timestamp).toBe(startSec);
    expect(filtered[1].timestamp).toBe(startSec + 100 * daySec);
  });

  it('returns expected score colors and aggregates total score', () => {
    expect(getScoreColor(1)).toBe('rgba(166, 0, 0, 0.9)');
    expect(getScoreColor(2)).toBe('rgba(250, 174, 42, 0.9)');
    expect(getScoreColor(3)).toBe('rgba(255, 236, 64, 0.9)');
    expect(getScoreColor(4)).toBe('rgba(2, 189, 46, 0.9)');

    expect(getTotalScoreColor(8)).toBe('rgba(166, 0, 0, 0.7)');
    expect(getTotalScoreColor(12)).toBe('rgba(250, 174, 42, 0.7)');
    expect(getTotalScoreColor(16)).toBe('rgba(255, 236, 64, 0.7)');
    expect(getTotalScoreColor(20)).toBe('rgba(2, 189, 46, 0.7)');

    expect(getTotalScore([2, 3, 4])).toBe(9);
  });
});
