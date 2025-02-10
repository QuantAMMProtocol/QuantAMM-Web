import { format, fromUnixTime, getTime } from 'date-fns';
import {
  GetPoolByIdQuery,
  GqlPoolDynamicData,
  GqlPoolMinimal,
} from '../../../__generated__/graphql-types';
import {
  DailyPerformance,
  Product,
  Strategy,
  StrategyEnum,
  MonthlyPerformance,
  PoolTimeSeriesData,
  TimeSeriesData,
  PerformancePeriod,
  CURRENT_PERFORMANCE_PERIOD,
  ExtendedTimeRange,
} from '../../../models';
import { MAX_SCORE } from '../../shared/graphs/helpers';
import { TimeRange } from '../../../models';
import {
  filterByTimeRange,
  filterByExtendedTimeRange,
} from '../../productDetail/productDetailContent/helpers';
import { DataPoint } from './types';

const formatTimestamp = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), 'yyyy/MM/dd HH:mm:ss');
};

// TODO: getProductRecordFromPoolList and getProductFromPool have some shared logic, can we abstract it out?
export function getProductRecordFromPoolList(
  pools: GqlPoolMinimal[],
  snapshots: PoolTimeSeriesData[]
): Record<string, Product> {
  return pools.reduce(
    (acc, pool) => {
      const snapshot =
        snapshots.find((s) => s.poolId === pool.id) ??
        ({} as PoolTimeSeriesData);

      const dailyPerformance: DailyPerformance[] = snapshot?.timeSeries.map(
        (element) => {
          return {
            date: formatTimestamp(element.timestamp),
            value: element.sharePrice,
          };
        }
      );
      acc[pool.id] = {
        id: pool.id,
        address: String(pool.address),
        name: pool.name || '',
        symbol: pool.symbol,
        decimals: pool.decimals,
        basketTheme: 'Main Cap', // TODO: get from pool
        tokenType: pool.type,
        strategy: getStrategy(pool),
        chain: pool.chain,
        frequency: 'daily', // TODO: get from pool
        memory: 30,
        market: 'adaptive',
        createTime: formatTimestamp(pool.createTime),
        swapManager: pool.swapFeeManager,
        pauseManager: pool.pauseManager,
        disableUnbalancedLiquidity:
          pool.liquidityManagement?.disableUnbalancedLiquidity?.valueOf(),
        enableAddLiquidityCustom:
          pool.liquidityManagement?.enableAddLiquidityCustom?.valueOf(),
        enableDonation: pool.liquidityManagement?.enableDonation?.valueOf(),
        enableRemoveLiquidityCustom:
          pool.liquidityManagement?.enableRemoveLiquidityCustom?.valueOf(),
        overview: [
          {
            metric: 'tvl',
            value: getTvlRating(pool, pools),
            maxScore: MAX_SCORE,
            description:
              '<p>TVL rating is the relative size of the pool compared to other pools in the protocol.</p>' +
              '<p>Top 20%=5</p>' +
              '<p>20-40%=4</p>' +
              '<p>40-60%=3</p>' +
              '<p>60-80%=2.</p>' +
              '<p>Pools under 2k are scored as 1.</p>',
          },
          {
            metric: 'performance',
            value: getPoolPerformanceRating(pool, pools, snapshots),
            maxScore: MAX_SCORE,
            description:
              '<p>Performance rating is the relative performance of the pool compared to other pools in the protocol.' +
              '<p>Top 20%=5</p>' +
              '<p>20-40%=4</p>' +
              '<p>40-60%=3</p>' +
              '<p>60-80%=2</p>' +
              '<p>As negative performance is never good a negative performance is always scored as 2</p>',
          },
          {
            metric: 'adaptability',
            value: getAdaptability('Fixed', '', ''),
            maxScore: MAX_SCORE,
            description:
              'Adaptability rating is how well the pool can adapt to market conditions, this tends to be a fixed property of the pool type and is subjective',
          },
          {
            metric: 'diversification',
            value: pool.allTokens.length > 5 ? 5 : pool.allTokens.length - 1,
            maxScore: MAX_SCORE,
            description:
              'Diversification rating is how many tokens are in the pool. If there are more than 5 that is a max score of 5 otherwise the score is n-1',
          },
          {
            metric: 'yield',
            value: getYieldRating(pool, pools),
            maxScore: MAX_SCORE,
            description:
              '<p>The yield return relative to other pools in the protocol.</p>' +
              '<p>Top 20%=5</p>' +
              '<p>20-40%=4</p>' +
              '<p>40-60%=3</p>' +
              '<p>60-80%=2</p>' +
              '<p>80-100%=1</p>',
          },
        ],
        timeSeries: snapshot?.timeSeries ?? ([] as TimeSeriesData[]),
        dailyPerformance,

        monthlyPerformance: mapDailyPerformanceToPerformance(dailyPerformance),
        currentPerformance: getCurrentPerformance(
          dailyPerformance,
          CURRENT_PERFORMANCE_PERIOD
        ),
        poolConstituents: (pool.allTokens || []).map((token) => ({
          coin: token.symbol,
          weight:
            parseFloat(
              token.weight ?? (100 / pool.allTokens.length).toString()
            ) * 100,
          address: token.address,
        })),
        dynamicData: pool.dynamicData,
        inceptionPerformance: getCurrentSharePrice(dailyPerformance, 'max'),
        oneYearPerformance: getCurrentSharePrice(dailyPerformance, '1y'),
        sixMonthPerformance: getCurrentSharePrice(dailyPerformance, '6m'),
        threeMonthPerformance: getCurrentSharePrice(dailyPerformance, '3m'),
        oneMonthPerformance: getCurrentSharePrice(dailyPerformance, '1m'),
        oneWeekPerformance: getCurrentSharePrice(dailyPerformance, '7d'),
        benchmarkNames: ['HODL'],
        benchmarkTimeSeries: [],
      };
      return acc;
    },
    {} as Record<string, Product>
  );
}

export function getProductFromPool(
  poolData: GetPoolByIdQuery,
  snapshot: PoolTimeSeriesData
): Product {
  const pool = poolData.poolGetPool;

  const dailyPerformance: DailyPerformance[] = snapshot.timeSeries.map(
    (element) => {
      return {
        date: formatTimestamp(element.timestamp),
        value: element.sharePrice,
      };
    }
  );

  const product: Product = {
    id: pool.id,
    address: String(pool.address),
    name: pool.name || '',
    symbol: pool.symbol,
    decimals: pool.decimals,
    basketTheme: 'Main Cap',
    tokenType: pool.type,
    strategy: 'MOMENTUM', // TODO: get from pool
    chain: pool.chain,
    frequency: 'daily',
    memory: 30,
    market: 'adaptive',
    createTime: formatTimestamp(pool.createTime),
    swapManager: '', //TODO

    pauseManager: '',
    overview: [
      {
        metric: 'tvl',
        value: 1, // TODO: how to get this?
        maxScore: MAX_SCORE,
        description: 'TVL rating is blah blah blah',
      },
      {
        metric: 'performance',
        value: 1, // TODO: how to get this?
        maxScore: MAX_SCORE,
        description: 'Performance rating is blah blah blah blah ',
      },
      {
        metric: 'adaptability',
        value: getAdaptability('Fixed', '', ''), // TODO: get from pool
        maxScore: MAX_SCORE,
        description: 'Adaptability rating is blah blah blah blah ',
      },
      {
        metric: 'diversification',
        value: pool.allTokens.length > 5 ? 5 : pool.allTokens.length - 1,
        maxScore: MAX_SCORE,
        description: 'Diversification rating is blah blah blah blah ',
      },
      {
        metric: 'yield',
        value: 1, // TODO: how to get this?
        maxScore: MAX_SCORE,
        description: '',
      },
    ],
    timeSeries: snapshot?.timeSeries ?? ([] as TimeSeriesData[]),
    dailyPerformance,

    monthlyPerformance: mapDailyPerformanceToPerformance(dailyPerformance),
    currentPerformance: getCurrentPerformance(
      dailyPerformance,
      CURRENT_PERFORMANCE_PERIOD
    ),
    poolConstituents: (pool.allTokens || []).map((token) => ({
      coin: token.symbol,
      weight:
        parseFloat(token.weight ?? (100 / pool.allTokens.length).toString()) *
        100,
      address: token.address,
    })),
    dynamicData: {} as GqlPoolDynamicData, // TODO: pool.dynamicData ?
    inceptionPerformance: getCurrentSharePrice(dailyPerformance, 'max'),
    oneYearPerformance: getCurrentSharePrice(dailyPerformance, '1y'),
    sixMonthPerformance: getCurrentSharePrice(dailyPerformance, '6m'),
    threeMonthPerformance: getCurrentSharePrice(dailyPerformance, '3m'),
    oneMonthPerformance: getCurrentSharePrice(dailyPerformance, '1m'),
    oneWeekPerformance: getCurrentSharePrice(dailyPerformance, '7d'),
    benchmarkNames: ['HODL'],
    benchmarkTimeSeries: [],
  };

  return product;
}

interface performanceSummary {
  poolId: string;
  currentPerformance: number;
}

function getPoolPerformanceRating(
  pool: GqlPoolMinimal,
  pools: GqlPoolMinimal[],
  snapshots: PoolTimeSeriesData[]
) {
  const poolPerformance: performanceSummary[] = [];
  pools.forEach((pool) => {
    const snapshot =
      snapshots.find((s) => s.poolId === pool.id) ?? ({} as PoolTimeSeriesData);

    const dailyPerformance: DailyPerformance[] = snapshot?.timeSeries.map(
      (element) => {
        return {
          date: formatTimestamp(element.timestamp),
          value: element.sharePrice,
        };
      }
    );
    poolPerformance.push({
      poolId: pool.id,
      currentPerformance: getCurrentPerformance(dailyPerformance, '3m'),
    });
  });

  const orderedPools = poolPerformance.sort(
    (a, b) => a.currentPerformance - b.currentPerformance
  );

  const indexOfProductByProductId = orderedPools.findIndex(
    (x) => x.poolId === pool.id
  );

  const rating = rateOrderedIndex(
    indexOfProductByProductId,
    orderedPools.length
  );
  const poolCurrentPerformance =
    orderedPools[indexOfProductByProductId].currentPerformance;

  if (poolCurrentPerformance <= 0 && rating > 2) {
    //while it is rational to scale the rating based on relative performance in the protocol,
    //a negative rating should never be more than 2.5 i.e. middle of the range, it is always sub par
    return 2;
  }

  return rating;
}

function getOrderedRating(
  pool: GqlPoolMinimal,
  orderedPools: GqlPoolMinimal[],
  poolValue?: number | null | string
) {
  if (poolValue === 0 || Number.isNaN(poolValue)) {
    return 1;
  }

  const indexOfPoolByPoolId = orderedPools.findIndex((x) => x.id === pool.id);

  return rateOrderedIndex(indexOfPoolByPoolId, orderedPools.length);
}

function rateOrderedIndex(index: number, length: number): number {
  const indexPercentage = index / length;
  if (indexPercentage < 0.2) {
    return 1;
  }
  if (indexPercentage < 0.4) {
    return 2;
  }
  if (indexPercentage < 0.6) {
    return 3;
  }
  if (indexPercentage < 0.8) {
    return 4;
  }
  return 5;
}

function getTvlRating(pool: GqlPoolMinimal, pools: GqlPoolMinimal[]) {
  const orderedPools = [...pools].sort(
    (a, b) =>
      parseFloat(a.dynamicData.totalLiquidity) -
      parseFloat(b.dynamicData.totalLiquidity)
  );

  const rating = getOrderedRating(
    pool,
    orderedPools,
    parseFloat(pool.dynamicData.totalLiquidity)
  );

  if (parseFloat(pool.dynamicData.totalLiquidity) <= 2000) {
    //while it is rational to scale the rating based on relative TVL in the protocol,
    //a small TVL should never be more than 2.5 i.e. expected middle of the range, it is always sub par
    return 1;
  }

  return rating;
}

function getYieldRating(pool: GqlPoolMinimal, pools: GqlPoolMinimal[]) {
  const orderedPools = [...pools].sort(
    (a, b) =>
      parseFloat(a.dynamicData.yieldCapture48h ?? 0) -
      parseFloat(b.dynamicData.yieldCapture48h ?? 0)
  );

  return getOrderedRating(
    pool,
    orderedPools,
    parseFloat(pool.dynamicData.yieldCapture48h)
  );
}

function getAdaptability(
  poolType: string,
  strategy: string,
  parameters: string
): number {
  if (poolType == 'FIXED') {
    return 1;
  } else if (poolType == 'QUANTAMM') {
    //TODO CH could make dynamic
    if (strategy == 'Momentum') {
      if (parameters == 'Vector') {
        return 4;
      }
      return 3;
    } else if (strategy == 'Anti-Momentum') {
      if (parameters == 'Vector') {
        return 4;
      }
      return 3;
    } else if (strategy == 'Minimum Variance') {
      if (parameters == 'Vector') {
        return 3;
      }
      return 2;
    } else if (strategy == 'Channel Following') {
      if (parameters == 'Vector') {
        return 5;
      }
      return 4;
    } else if (strategy == 'Difference Momentum') {
      if (parameters == 'Vector') {
        return 5;
      }

      return 4;
    }
  }

  return 3;
}

export function fetchTokenList(pools: GqlPoolMinimal[]): string[] {
  return Array.from(
    pools.reduce((acc, pool) => {
      pool.allTokens.forEach((token) => acc.add(token.address));
      return acc;
    }, new Set<string>())
  );
}

function parseDate(month: string): Date {
  // Parse a date string formatted as 'MMM DD' to a Date object assuming the current year
  const year = new Date().getFullYear();
  return new Date(`${month} ${year}`);
}

function findNearestToFirst(
  data: DataPoint[],
  targetDate: Date
): DataPoint | undefined {
  // Find the data point that is nearest to the first of the month
  return data.reduce(
    (nearest, current) => {
      const currentDate = parseDate(current.month);
      const currentDiff = Math.abs(
        currentDate.getTime() - targetDate.getTime()
      );
      const nearestDiff = nearest
        ? Math.abs(parseDate(nearest.month).getTime() - targetDate.getTime())
        : Infinity;
      return currentDiff < nearestDiff ? current : nearest;
    },
    undefined as DataPoint | undefined
  );
}

export function calculateMonthlyDeltas(
  data: DataPoint[]
): Record<string, number> {
  const deltas: Record<string, number> = {};
  const sortedData = [...data].sort(
    (a, b) => parseDate(a.month).getTime() - parseDate(b.month).getTime()
  );
  const monthlyValues: Record<string, DataPoint> = {};
  // First, collect the nearest values to the first of each month
  sortedData.forEach((dp) => {
    const date = parseDate(dp.month);
    const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const bestMatch = findNearestToFirst(data, firstOfMonth);
    if (bestMatch) {
      monthlyValues[monthKey] = bestMatch;
    }
  });
  // Calculate the deltas
  let previousValue: DataPoint | undefined;
  Object.keys(monthlyValues).forEach((monthKey) => {
    if (previousValue) {
      const currentValue = monthlyValues[monthKey];
      const delta =
        ((currentValue.value - previousValue.value) / previousValue.value) * 10;
      deltas[monthKey] = delta;
    }
    previousValue = monthlyValues[monthKey];
  });
  return deltas;
}

const getCurrentSharePrice = (
  timeSeries: DailyPerformance[],
  period: ExtendedTimeRange
): PerformancePeriod => {
  const findFirstNonZeroPerformance = timeSeries.findIndex(
    (dataPoint) => dataPoint.value !== 0
  );

  if (findFirstNonZeroPerformance === -1) {
    return {
      sharePrice: 0,
      return: 0,
    };
  }

  const filteredTimeSeries = timeSeries
    .slice(findFirstNonZeroPerformance)
    .filter((dataPoint) =>
      filterByExtendedTimeRange(getTime(dataPoint.date) / 1000, period)
    );

  if (filteredTimeSeries.length === 0) {
    return {
      sharePrice: 0,
      return: 0,
    };
  }

  const todaysSharePrice =
    filteredTimeSeries[filteredTimeSeries.length - 1]?.value;

  const initialSharePrice = filteredTimeSeries[0]?.value;

  if (initialSharePrice === todaysSharePrice) {
    return {
      sharePrice: todaysSharePrice,
      return: 0,
    };
  }

  return {
    sharePrice: todaysSharePrice,
    return: ((todaysSharePrice - initialSharePrice) / initialSharePrice) * 100,
  };
};

const getCurrentPerformance = (
  performance: DailyPerformance[],
  period: TimeRange
): number => {
  const findFirstNonZeroPerformance = performance.findIndex(
    (dataPoint) => dataPoint.value !== 0
  );

  if (findFirstNonZeroPerformance === -1) {
    return 0;
  }

  const filteredPerformance = performance
    .slice(findFirstNonZeroPerformance)
    .filter((dataPoint) =>
      filterByTimeRange(getTime(dataPoint.date) / 1000, period)
    );

  if (filteredPerformance.length === 0) {
    return 0;
  }

  const todaysPerformance =
    filteredPerformance[filteredPerformance.length - 1]?.value;

  const initialPerformance = filteredPerformance[0]?.value;

  if (initialPerformance === todaysPerformance) {
    return 0;
  }

  return ((todaysPerformance - initialPerformance) / initialPerformance) * 100;
};

const mapDailyPerformanceToPerformance = (
  daily: DailyPerformance[]
): MonthlyPerformance[] => {
  const monthlyData = Object.entries(
    daily.reduce(
      (current, next) => {
        const month = format(new Date(next.date), 'LLL yy');
        if (!current[month]) {
          current[month] = next.value;
        } else current[month] += next.value;

        return current;
      },
      {} as Record<string, number>
    )
  ).map(([month, value]) => {
    return { month, value };
  });

  return monthlyData;
};

const getStrategy = (pool: GqlPoolMinimal): Strategy => {
  const { tags } = pool;
  if (Array.isArray(tags) && tags.length > 0) {
    return Object.values(StrategyEnum).includes(tags[0] as Strategy)
      ? (tags[0] as Strategy)
      : 'NONE';
  }

  return 'NONE';
};
