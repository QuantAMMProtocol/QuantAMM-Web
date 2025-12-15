import {
  ReturnTimeStep,
  SimulationRunLiquidityPoolSnapshot,
} from '../simulationResults/simulationResultSummaryModels';
import {
  CoinComparison,
  CoinPrice,
  LiquidityPool,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import { updatePoolWeights } from '../simulationRunConfiguration/simulationRunConfigurationSlice';

function getUniqueTimes(pool: LiquidityPool) {
  let uniqueTimes: number[] = [];
  pool.poolConstituents.forEach(
    (x) =>
      (uniqueTimes = [
        ...uniqueTimes,
        ...x.coin.dailyPriceHistory.map((y) => y.unix),
      ])
  );

  uniqueTimes = uniqueTimes
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => {
      return a - b;
    });
  return uniqueTimes;
}

export function runHodl(
  pool: LiquidityPool,
  startDateUnix: number,
  endDateUnix: number
): SimulationRunLiquidityPoolSnapshot[] {
  let uniqueTimes: number[] = getUniqueTimes(pool);
  uniqueTimes = uniqueTimes.filter(
    (x) => x >= startDateUnix && x < endDateUnix
  );
  if (uniqueTimes.length == 0) {
    uniqueTimes = uniqueTimes.filter(
      (x) => x > startDateUnix / 1000 && x < endDateUnix / 1000
    );
  }
  const results: SimulationRunLiquidityPoolSnapshot[] = [];

  uniqueTimes.forEach((x) => {
    const snapshot: SimulationRunLiquidityPoolSnapshot = {
      unix: x,
      date: new Date(x).toLocaleString(),
      coinsHeld: [],
      hodlEquiv: undefined,
      feeForSnapshot: 0,
      totalFeesReceivedToDate: 0,
      totalPoolMarketValue: 0,
    };

    pool.poolConstituents.forEach((y) => {
      const currentPrice = y.coin.dailyPriceHistoryMap.get(x);
      if (y.amount) {
        if (currentPrice != undefined) {
          snapshot.coinsHeld.push({
            coin: {
              coinCode: y.coin.coinCode,
              coinName: y.coin.coinName,
              dailyPriceHistory: [], // no need to store histories here
              dailyPriceHistoryMap: new Map<number, CoinPrice>(),
              dailyReturns: new Map<number, ReturnTimeStep>(),
              coinComparisons: new Map<string, CoinComparison>(),
              deploymentByChain: y.coin.deploymentByChain,
            },
            amount: y.amount,
            marketValue: y.amount * currentPrice.close,
            currentPrice: currentPrice.close,
            currentPriceUnix: x,
            weight: 0, // update later
            factorValue: y.factorValue,
          });
          snapshot.totalPoolMarketValue += y.amount * currentPrice.close;
        } else if (y.currentPrice) {
          //keep price same as last if no price recorded for time
          let latest = y;
          if (results.length > 0) {
            latest =
              results[results.length - 1].coinsHeld.find(
                (z) => z.coin.coinCode == y.coin.coinCode
              ) ?? y;
          }
          snapshot.coinsHeld.push({
            coin: {
              coinCode: latest.coin.coinCode,
              coinName: latest.coin.coinName,
              dailyPriceHistory: [], // no need to store histories here
              dailyPriceHistoryMap: new Map<number, CoinPrice>(),
              dailyReturns: new Map<number, ReturnTimeStep>(),
              coinComparisons: new Map<string, CoinComparison>(),
              deploymentByChain: latest.coin.deploymentByChain,
            },
            amount: latest.amount,
            marketValue: latest.marketValue,
            currentPrice: latest.currentPrice,
            currentPriceUnix: latest.currentPriceUnix,
            factorValue: y.factorValue,
            weight: 0, // update later
          });
          snapshot.totalPoolMarketValue += y.amount * y.currentPrice;
        }
      }
    });

    updatePoolWeights(snapshot.coinsHeld);
    results.push(snapshot);
  });

  return results;
}
export function runBalancer(
  pool: LiquidityPool,
  startDateUnix: number,
  endDateUnix: number
): SimulationRunLiquidityPoolSnapshot[] {
  let uniqueTimes: number[] = getUniqueTimes(pool);
  uniqueTimes = uniqueTimes.filter(
    (x) => x >= startDateUnix && x <= endDateUnix
  );
  if (uniqueTimes.length == 0) {
    uniqueTimes = uniqueTimes.filter(
      (x) => x >= startDateUnix / 1000 && x <= endDateUnix / 1000
    );
  }
  const results: SimulationRunLiquidityPoolSnapshot[] = [];
  for (let i = 0; i < uniqueTimes.length; i++) {
    const x = uniqueTimes[i];

    const snapshot: SimulationRunLiquidityPoolSnapshot = {
      unix: x,
      date: new Date(x).toLocaleString(),
      coinsHeld: [],
      hodlEquiv: undefined,
      feeForSnapshot: 0,
      totalFeesReceivedToDate: 0,
      totalPoolMarketValue: 0,
    };

    const initialValue = 1;
    const jPrice = pool.poolConstituents.reduce((prev, currentItem) => {
      const currentPrice =
        currentItem.coin.dailyPriceHistoryMap.get(x)?.close ??
        currentItem.currentPrice;
      let coinP;

      if (currentPrice == undefined || currentItem.currentPrice == undefined) {
        coinP = 1;
      } else {
        coinP = currentPrice / currentItem.currentPrice;
      }

      if (currentItem.weight) {
        return prev * Math.pow(coinP, currentItem.weight / 100);
      }

      return prev;
    }, initialValue);

    pool.poolConstituents.forEach((y) => {
      const currentPrice = y.coin.dailyPriceHistoryMap.get(x)?.close;

      if (i != 0 && currentPrice != undefined) {
        if (currentPrice != undefined && y.amount && y.currentPrice) {
          const newAmount = y.amount * (y.currentPrice / currentPrice) * jPrice;
          snapshot.coinsHeld.push({
            coin: {
              coinCode: y.coin.coinCode,
              coinName: y.coin.coinName,
              dailyPriceHistory: [], // no need to store histories here
              dailyPriceHistoryMap: new Map<number, CoinPrice>(),
              dailyReturns: new Map<number, ReturnTimeStep>(),
              coinComparisons: new Map<string, CoinComparison>(),
              deploymentByChain: y.coin.deploymentByChain,
            },
            amount: newAmount,
            marketValue: newAmount * currentPrice,
            currentPrice: currentPrice,
            currentPriceUnix: x,
            factorValue: y.factorValue,
            weight: 0, // update later
          });
        }
      } else {
        //keep price same as last if no price recorded for time
        let latest = y;
        if (results.length > 0) {
          latest =
            results[results.length - 1].coinsHeld.find(
              (z) => z.coin.coinCode == y.coin.coinCode
            ) ?? y;
        }
        snapshot.coinsHeld.push({
          coin: {
            coinCode: latest.coin.coinCode,
            coinName: latest.coin.coinName,
            dailyPriceHistory: [], // no need to store histories here
            dailyPriceHistoryMap: new Map<number, CoinPrice>(),
            dailyReturns: new Map<number, ReturnTimeStep>(),
            coinComparisons: new Map<string, CoinComparison>(),
            deploymentByChain: latest.coin.deploymentByChain,
          },
          amount: latest.amount,
          marketValue: latest.marketValue,
          currentPrice: latest.currentPrice,
          currentPriceUnix: latest.currentPriceUnix,
          factorValue: y.factorValue,
          weight: 0, // update later
        });
      }
    });

    updatePoolWeights(snapshot.coinsHeld);

    snapshot.totalPoolMarketValue = snapshot.coinsHeld
      .map((x) => x.marketValue)
      .reduce<number>((accumulator, current) => {
        return accumulator + (current ?? 0);
      }, 0);

    if (results.length > 0) {
      const latest = results[results.length - 1];
      const fee =
        Math.abs(snapshot.totalPoolMarketValue - latest.totalPoolMarketValue) *
        0.004;
      //TODO crude fee calculation that is not correct. placeholder for when we model fees
      snapshot.feeForSnapshot = fee;
    }
    results.push(snapshot);
  }

  return results;
}
