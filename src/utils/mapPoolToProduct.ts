import BigNumber from 'bignumber.js';
import { format, fromUnixTime, getTime } from 'date-fns';
import {
  GetPoolByIdQuery,
  GqlPoolDynamicData,
  GqlPoolMinimal,
  GqlPoolQuantAmmWeighted,
  Maybe,
  QuantAmmWeightedParams,
} from '../__generated__/graphql-types';
import {
  DailyPerformance,
  Product,
  Strategy,
  MonthlyPerformance,
  ProductTimeSeriesData,
  TimeSeriesData,
  PerformancePeriod,
  CURRENT_PERFORMANCE_PERIOD,
  ExtendedTimeRange,
  ProductMap,
} from '../models';
import { MAX_SCORE } from '../features/shared/graphs/helpers';
import { TimeRange } from '../models';
import {
  filterByTimeRange,
  filterByExtendedTimeRange,
} from '../features/productDetail/productDetailContent/helpers';
import { useAprTooltip } from '../features/productExplorer/productItem/shared/apr/useAprTooltip';
import { isQuantAmmPool } from './poolHelpers';

const formatTimestamp = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), 'yyyy/MM/dd HH:mm:ss');
};

export const mapPoolToBaseProduct = (pools: GqlPoolMinimal[]): ProductMap => {
  const productMap: ProductMap = {};

  pools.forEach((pool) => {
    const { getSortableApr } = useAprTooltip({
      aprItems: pool.dynamicData?.aprItems ?? [],
      numberFormatter: (value) => new BigNumber(value),
      chain: pool.chain,
    });

    productMap[pool.id] = {
      id: pool.id,
      address: String(pool.address),
      name: pool.name || '',
      symbol: pool.symbol,
      decimals: pool.decimals,
      basketTheme: 'Main Cap', // TODO: get from pool
      type: pool.type,
      hook: pool.hook,
      tokenType: pool.type, // TODO: unnecessary?
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
      overview: [],
      poolConstituents: (pool.poolTokens || []).map((token) => ({
        coin: token.symbol,
        weight:
          parseFloat(
            token.weight ?? (100 / pool.poolTokens.length).toString()
          ) * 100,
        address: token.address,
      })),
      dynamicData: pool.dynamicData,
      benchmarkNames: ['HODL'],
      benchmarkTimeSeries: [],
      sortableApr: getSortableApr(pool.id),
    };
  });

  return productMap;
};

export const getFullProductsFromSnapshots = (
  productMap: ProductMap,
  snapshots: ProductTimeSeriesData[]
): ProductMap => {
  const products = Object.values(productMap);
  const fullProductMap: ProductMap = {};

  products.forEach((product) => {
    const snapshot =
      snapshots.find((s) => s.productId === product.id) ??
      ({} as ProductTimeSeriesData);

    const dailyPerformance: DailyPerformance[] = snapshot?.timeSeries.map(
      (element) => {
        return {
          date: formatTimestamp(element.timestamp),
          value: element.sharePrice,
        };
      }
    );

    fullProductMap[product.id] = {
      ...product,
      overview: [
        {
          metric: 'tvl',
          value: getTvlRating(product, products),
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
          value: getProductPerformanceRating(product, products, snapshots),
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
          value:
            product.poolConstituents.length > 5
              ? 5
              : product.poolConstituents.length - 1,
          maxScore: MAX_SCORE,
          description:
            'Diversification rating is how many tokens are in the pool. If there are more than 5 that is a max score of 5 otherwise the score is n-1',
        },
        {
          metric: 'yield',
          value: getYieldRating(product, products),
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
      timeSeries: snapshot?.timeSeries,
      dailyPerformance,

      monthlyPerformance:
        mapDailyPerformanceToMonthlyPerformance(dailyPerformance),
      currentPerformance: getCurrentPerformance(
        dailyPerformance,
        CURRENT_PERFORMANCE_PERIOD
      ),
      inceptionPerformance: getCurrentSharePrice(dailyPerformance, 'max'),
      oneYearPerformance: getCurrentSharePrice(dailyPerformance, '1y'),
      sixMonthPerformance: getCurrentSharePrice(dailyPerformance, '6m'),
      threeMonthPerformance: getCurrentSharePrice(dailyPerformance, '3m'),
      oneMonthPerformance: getCurrentSharePrice(dailyPerformance, '1m'),
      oneWeekPerformance: getCurrentSharePrice(dailyPerformance, '7d'),
    };
  });

  return fullProductMap;
};

export const getProductFromPool = (
  poolData: GetPoolByIdQuery,
  snapshot: ProductTimeSeriesData
): Product => {
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
    type: pool.type,
    tokenType: pool.type,
    strategy: getStrategy(pool as unknown as GqlPoolMinimal),
    chain: pool.chain,
    frequency: 'daily',
    memory: 30,
    market: 'adaptive',
    createTime: formatTimestamp(pool.createTime),
    swapManager: '', // TODO: how to get this?

    pauseManager: '',
    overview: [
      {
        metric: 'tvl',
        value: 1, // TODO: how to get this?
        maxScore: MAX_SCORE,
        description: 'TVL rating is blah blah blah', // TODO: add proper description
      },
      {
        metric: 'performance',
        value: 1, // TODO: how to get this?
        maxScore: MAX_SCORE,
        description: 'Performance rating is blah blah blah blah ', // TODO: add proper description
      },
      {
        metric: 'adaptability',
        value: getAdaptabilityScore(pool as unknown as GqlPoolMinimal),
        maxScore: MAX_SCORE,
        description: 'Adaptability rating is blah blah blah blah ', // TODO: add proper description
      },
      {
        metric: 'diversification',
        value: pool.poolTokens.length > 5 ? 5 : pool.poolTokens.length - 1,
        maxScore: MAX_SCORE,
        description: 'Diversification rating is blah blah blah blah ', // TODO: add proper description
      },
      {
        metric: 'yield',
        value: 1, // TODO: how to get this?
        maxScore: MAX_SCORE,
        description: 'Yield rating is blah blah blah blah ', // TODO: add proper description
      },
    ],
    timeSeries: snapshot?.timeSeries ?? ([] as TimeSeriesData[]),
    dailyPerformance,

    monthlyPerformance:
      mapDailyPerformanceToMonthlyPerformance(dailyPerformance),
    currentPerformance: getCurrentPerformance(
      dailyPerformance,
      CURRENT_PERFORMANCE_PERIOD
    ),
    poolConstituents: (pool.poolTokens || []).map((token) => ({
      coin: token.symbol,
      weight:
        parseFloat(token.weight ?? (100 / pool.poolTokens.length).toString()) *
        100,
      address: token.address,
    })),
    dynamicData: pool.dynamicData as GqlPoolDynamicData,
    inceptionPerformance: getCurrentSharePrice(dailyPerformance, 'max'),
    oneYearPerformance: getCurrentSharePrice(dailyPerformance, '1y'),
    sixMonthPerformance: getCurrentSharePrice(dailyPerformance, '6m'),
    threeMonthPerformance: getCurrentSharePrice(dailyPerformance, '3m'),
    oneMonthPerformance: getCurrentSharePrice(dailyPerformance, '1m'),
    oneWeekPerformance: getCurrentSharePrice(dailyPerformance, '7d'),
    benchmarkNames: ['HODL'],
    benchmarkTimeSeries: [],
    quantAmmWeightedParams: getMaybeQuantAmmWeightedParams(
      pool as unknown as GqlPoolMinimal
    ),
  };

  return product;
};

interface ProductPerformanceSummary {
  productId: string;
  currentPerformance: number | undefined;
}

function getProductPerformanceRating(
  product: Product,
  products: Product[],
  snapshots: ProductTimeSeriesData[]
) {
  if (snapshots.length === 0) {
    return 0;
  }
  const productPerformance: ProductPerformanceSummary[] = [];
  products.forEach((product) => {
    const snapshot =
      snapshots.find((s) => s.productId === product.id) ??
      ({} as ProductTimeSeriesData);

    const dailyPerformance: DailyPerformance[] = snapshot?.timeSeries.map(
      (element) => {
        return {
          date: formatTimestamp(element.timestamp),
          value: element.sharePrice,
        };
      }
    );
    productPerformance.push({
      productId: product.id,
      currentPerformance: getCurrentPerformance(dailyPerformance, '3m'),
    });
  });

  const orderedProducts = productPerformance.sort(
    (a, b) => (a.currentPerformance ?? 0) - (b.currentPerformance ?? 0)
  );

  const indexOfProductByProductId = orderedProducts.findIndex(
    (x) => x.productId === product.id
  );

  const rating = rateOrderedIndex(
    indexOfProductByProductId,
    orderedProducts.length
  );
  const productCurrentPerformance =
    orderedProducts[indexOfProductByProductId].currentPerformance;

  if ((productCurrentPerformance ?? 0) <= 0 && rating > 2) {
    //while it is rational to scale the rating based on relative performance in the protocol,
    //a negative rating should never be more than 2.5 i.e. middle of the range, it is always sub par
    return 2;
  }

  return rating;
}

function getOrderedRating(
  product: Product,
  orderedProducts: Product[],
  productValue?: number | null | string
) {
  if (productValue === 0 || Number.isNaN(productValue)) {
    return 1;
  }

  const indexOfProductByProductId = orderedProducts.findIndex(
    (x) => x.id === product.id
  );

  return rateOrderedIndex(indexOfProductByProductId, orderedProducts.length);
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

function getTvlRating(product: Product, products: Product[]) {
  const orderedProducts = [...products].sort(
    (a, b) =>
      parseFloat(a.dynamicData?.totalLiquidity ?? '0') -
      parseFloat(b.dynamicData?.totalLiquidity ?? '0')
  );

  const rating = getOrderedRating(
    product,
    orderedProducts,
    parseFloat(product.dynamicData?.totalLiquidity ?? '0')
  );

  if (parseFloat(product.dynamicData?.totalLiquidity ?? '0') <= 2000) {
    //while it is rational to scale the rating based on relative TVL in the protocol,
    //a small TVL should never be more than 2.5 i.e. expected middle of the range, it is always sub par
    return 1;
  }

  return rating;
}

function getYieldRating(product: Product, products: Product[]) {
  const orderedProducts = [...products].sort(
    (a, b) =>
      parseFloat(a.dynamicData?.yieldCapture48h ?? '0') -
      parseFloat(b.dynamicData?.yieldCapture48h ?? '0')
  );

  return getOrderedRating(
    product,
    orderedProducts,
    parseFloat(product.dynamicData?.yieldCapture48h ?? '0')
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
): number | undefined => {
  const findFirstNonZeroPerformance = performance.findIndex(
    (dataPoint) => dataPoint.value !== 0
  );

  if (findFirstNonZeroPerformance === -1) {
    return undefined;
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

const mapDailyPerformanceToMonthlyPerformance = (
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

const getMaybeQuantAmmWeightedParams = (
  pool: GqlPoolMinimal
): Maybe<QuantAmmWeightedParams> => {
  if (isQuantAmmPool(pool.type)) {
    const { quantAmmWeightedParams } =
      pool as unknown as GqlPoolQuantAmmWeighted;
    return quantAmmWeightedParams ?? null;
  }
  return null;
};

const getStrategy = (pool: GqlPoolMinimal): Strategy => {
  const quantAmmWeightedParams = getMaybeQuantAmmWeightedParams(pool);
  //API can be changed but in the meantime can be coded here
  if (
    pool.address.toLowerCase() ==
      '0x6b61d8680c4f9e560c8306807908553f95c749c5' ||
    pool.address.toLowerCase() == '0xb4161aea25bd6c5c8590ad50deb4ca752532f05d'
  ) {
    return 'POWER_CHANNEL';
  }
  else if (pool.address.toLowerCase() == '0x74dc857d5567a3b087e79b96b91cdc8099b2fa34'){
    return 'CHANNEL_FOLLOWING';
  }
    
    
    if (quantAmmWeightedParams) {
    const { details } = quantAmmWeightedParams;
    return details
      ?.find((detail) => detail.name === 'updateRuleName')
      ?.value?.toUpperCase()
      .replace(/ /g, '_') as Strategy | 'NONE';
  }

  return 'NONE';
};

const getAdaptabilityScore = (pool: GqlPoolMinimal): number => {
  const quantAmmWeightedParams = getMaybeQuantAmmWeightedParams(pool);

  if (quantAmmWeightedParams) {
    const { details } = quantAmmWeightedParams;

    const value = details?.find(
      (detail) => detail.name === 'adaptabilityScore'
    )?.value;

    return value ? Number(value) : 0;
  }

  return 0;
};
