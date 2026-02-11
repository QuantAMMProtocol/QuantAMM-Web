import { AgAreaSeriesOptions, AgTimeAxisOptions } from 'ag-charts-community';
import { format } from 'date-fns';
import { Product, ProductPoolConstituents, TimeSeriesData } from '../../../models';
import { getChartTimeStepsFromProduct } from './helpers';

export interface TokenWeightTimeStep {
  dateAsString: string;
  timeSeriesData: TimeSeriesData;
  timestamp: number;
  [key: string]: number | string | TimeSeriesData;
}

export const normalisedTokenName = (token: string) => {
  return token.replace(/\./g, '-');
};

export const getFilteredConstituents = (product: Product) => {
  const poolBptTokenAddress = product.id.substring(0, 42);
  const bptIndex = product.poolConstituents.findIndex(
    (token) => token.address === poolBptTokenAddress
  );

  if (bptIndex === -1) {
    return product.poolConstituents;
  }

  return product.poolConstituents.filter(
    (_: ProductPoolConstituents, index: number) => {
      return index !== bptIndex;
    }
  );
};

export const getTimeAxisOption = (
  normalisedTimeSeries: ReturnType<typeof getChartTimeStepsFromProduct>
): AgTimeAxisOptions => {
  if (normalisedTimeSeries.length < 1) {
    return {
      type: 'time',
    };
  }

  const [first] = normalisedTimeSeries;
  const last = normalisedTimeSeries[normalisedTimeSeries.length - 1];
  const startDate = first.timestamp * 1000;
  const endDate = last.timestamp * 1000;
  const totalDuration = endDate - startDate;

  const ticks: number[] = [startDate];

  if (normalisedTimeSeries.length < 2) {
    return {
      type: 'time',
      interval: {
        values: ticks,
      },
    };
  } else if (normalisedTimeSeries.length < 3) {
    ticks.push(endDate);
  } else {
    ticks.push(startDate + totalDuration / 2);
    ticks.push(endDate);
  }

  return {
    type: 'time',
    nice: false,
    interval: {
      values: ticks,
    },
    label: {
      format: '%d-%m-%y',
    },
    min: startDate,
    max: endDate,
  };
};

export const getBenchmarkEqualWeightedAmounts = (
  isBenchmark: boolean | undefined,
  normalisedTimeSeries: ReturnType<typeof getChartTimeStepsFromProduct>,
  filteredConstituents: ProductPoolConstituents[]
) => {
  if (!isBenchmark || normalisedTimeSeries.length === 0) {
    return [];
  }

  const firstTimeStep = normalisedTimeSeries[0];
  if (filteredConstituents.length === 0) {
    return [];
  }

  const totalLiquidity = firstTimeStep.amounts.reduce((sum, amount, index) => {
    const constituent = filteredConstituents[index];
    if (!constituent) {
      return sum;
    }
    const tokenPrice = firstTimeStep.tokenPrices[constituent.address] ?? 0;
    return sum + amount * tokenPrice;
  }, 0);

  if (totalLiquidity <= 0) {
    return filteredConstituents.map(() => 0);
  }

  return filteredConstituents.map((constituent) => {
    const tokenPrice = firstTimeStep.tokenPrices[constituent.address] ?? 0;
    const equalShare = totalLiquidity / filteredConstituents.length;
    if (tokenPrice <= 0) {
      return 0;
    }
    return equalShare / tokenPrice;
  });
};

export const getNormalisedAreaData = (
  normalisedTimeSeries: ReturnType<typeof getChartTimeStepsFromProduct>,
  filteredConstituents: ProductPoolConstituents[],
  isBenchmark: boolean | undefined,
  benchmarkEqualWeightedAmounts: number[]
) => {
  const result: TokenWeightTimeStep[] = [];

  normalisedTimeSeries.forEach((item) => {
    const timeStep: TokenWeightTimeStep = {
      dateAsString: format(item.timestamp * 1000, 'yyyy-MM-dd'),
      timestamp: item.timestamp * 1000,
      timeSeriesData: item,
    };

    filteredConstituents.forEach(
      (constituent: ProductPoolConstituents, index: number) => {
        if (isBenchmark) {
          timeStep[normalisedTokenName(constituent.coin.toLowerCase())] =
            (benchmarkEqualWeightedAmounts[index] ?? 0) *
            item.tokenPrices[constituent.address];
        } else {
          timeStep[normalisedTokenName(constituent.coin.toLowerCase())] = Number(
            item.amounts[index] * item.tokenPrices[constituent.address]
          );
        }
      }
    );

    result.push(timeStep);
  });

  return result;
};

export const getNormalisedAreaSeries = (
  filteredConstituents: ProductPoolConstituents[]
): AgAreaSeriesOptions[] => {
  const series: AgAreaSeriesOptions[] = [];

  filteredConstituents.forEach((constituent: ProductPoolConstituents) => {
    series.push({
      type: 'area',
      xKey: 'timestamp',
      yKey: normalisedTokenName(constituent.coin.toLowerCase()),
      yName: constituent.coin.toLowerCase(),
      normalizedTo: 100,
      stacked: true,
    });
  });

  return series;
};
