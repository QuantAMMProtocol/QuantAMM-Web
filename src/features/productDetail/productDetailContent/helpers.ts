import { isAfter, subDays, subMonths, subYears } from 'date-fns';
import { ExtendedTimeRange, TimeRange } from '../../../models';

export const filterByTimeRange = (
  timeStamp: number,
  selectedTimeRange: TimeRange
) => {
  if (selectedTimeRange === '7d') {
    return isAfter(timeStamp * 1000, subDays(new Date(), 7));
  }

  if (selectedTimeRange === '1m') {
    return isAfter(timeStamp * 1000, subMonths(new Date(), 1));
  }

  if (selectedTimeRange === '3m') {
    return isAfter(timeStamp * 1000, subMonths(new Date(), 3));
  }

  if (selectedTimeRange === '1y') {
    return isAfter(timeStamp * 1000, subYears(new Date(), 1));
  }

  if (selectedTimeRange === 'max') {
    return true;
  }

  return false;
};

export const filterByExtendedTimeRange = (
  timeStamp: number,
  selectedTimeRange: ExtendedTimeRange
) => {
  if (selectedTimeRange === '7d') {
    return isAfter(timeStamp * 1000, subDays(new Date(), 7));
  }

  if (selectedTimeRange === '1m') {
    return isAfter(timeStamp * 1000, subMonths(new Date(), 1));
  }

  if (selectedTimeRange === '3m') {
    return isAfter(timeStamp * 1000, subMonths(new Date(), 3));
  }

  if (selectedTimeRange === '6m') {
    return isAfter(timeStamp * 1000, subMonths(new Date(), 6));
  }

  if (selectedTimeRange === '1y') {
    return isAfter(timeStamp * 1000, subYears(new Date(), 1));
  }

  if (selectedTimeRange === 'max') {
    return true;
  }

  return false;
};
