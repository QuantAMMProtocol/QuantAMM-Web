import { batch } from 'react-redux';
import { AppThunk } from '../../app/store';
import { coinPriceRetrievalService } from './coinPriceRetrievalService';
import {
  CoinComparison,
  CoinPrice,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import { ReturnTimeStep } from '../simulationResults/simulationResultSummaryModels';
import {
  updateCoinLoadStatus,
  updateCoinPriceHistory,
  updateCoinPriceHistoryLoaded,
  updateCoinPriceHistoryLoadedStatus,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';

interface LoadPriceHistoryOptions {
  includePerCoinLoadStatus?: boolean;
}

export const loadPriceHistoryAsync =
  (options: LoadPriceHistoryOptions = {}): AppThunk =>
  async (dispatch, getState) => {
    const { includePerCoinLoadStatus = false } = options;

    const {
      availableCoins,
      coinPriceHistoryLoaded,
      coinPriceHistoryLoadedStatus,
    } = getState().simConfig;

    if (coinPriceHistoryLoaded || coinPriceHistoryLoadedStatus !== 'pending') {
      return;
    }

    dispatch(updateCoinPriceHistoryLoadedStatus('loading'));

    const results = await Promise.all(
      availableCoins.map(async (coin) => {
        const dailyPriceHistory = (await dispatch(
          coinPriceRetrievalService.endpoints.loadHistoricDailyPrices.initiate({
            coinCode: coin.coinCode,
          })
        )
          .unwrap()
          .catch(() => [])) as CoinPrice[];

        if (includePerCoinLoadStatus) {
          dispatch(updateCoinLoadStatus(`Daily ${coin.coinCode} prices `));
        }

        const dailyPriceHistoryMap = new Map<number, CoinPrice>();
        const dailyReturns = new Map<number, ReturnTimeStep>();

        dailyPriceHistory.forEach((pricePoint, index) => {
          dailyPriceHistoryMap.set(pricePoint.unix, pricePoint);
          const returnValue =
            index === 0
              ? 0
              : pricePoint.close / dailyPriceHistory[index - 1].close - 1;
          dailyReturns.set(pricePoint.unix, {
            date: pricePoint.date,
            unix: pricePoint.unix,
            return: returnValue,
          });
        });

        return {
          coin,
          dailyPriceHistory,
          dailyPriceHistoryMap,
          dailyReturns,
        };
      })
    );

    batch(() => {
      results.forEach(
        ({ coin, dailyPriceHistory, dailyPriceHistoryMap, dailyReturns }) => {
          dispatch(
            updateCoinPriceHistory({
              coinCode: coin.coinCode,
              coinName: coin.coinName,
              dailyPriceHistory,
              dailyPriceHistoryMap,
              dailyReturns,
              coinComparisons: new Map<string, CoinComparison>(),
              deploymentByChain: coin.deploymentByChain,
            })
          );
        }
      );
      dispatch(updateCoinPriceHistoryLoaded(true));
      dispatch(updateCoinPriceHistoryLoadedStatus('loaded'));
    });
  };
