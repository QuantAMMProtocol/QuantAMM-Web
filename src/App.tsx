import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useAppDispatch } from './app/hooks';
import { AppThunk } from './app/store';
import { initializeSimulationsToRun } from './features/simulationRunner/simulationRunnerSlice';
import { useLoadHistoricDailyPricesMutation } from './features/coinData/coinPriceRetrievalService';
import {
  CoinComparison,
  CoinPrice,
} from './features/simulationRunConfiguration/simulationRunConfigModels';
import { ReturnTimeStep } from './features/simulationResults/simulationResultSummaryModels';
import {
  updateCoinLoadStatus,
  updateCoinPriceHistory,
  updateCoinPriceHistoryLoaded,
  updateCoinPriceHistoryLoadedStatus,
} from './features/simulationRunConfiguration/simulationRunConfigurationSlice';
import { AntDesignThemeProvider } from './AntDesignThemeProvider';
import { MenuComponent } from './Menu';

import style from './app.module.scss';

export interface Success {
  data: CoinPrice[];
}

const { Content, Header } = Layout;

const initialiseSimsToRun = (): AppThunk => (dispatch, getState) => {
  if (getState().simRunner.simulationsToRun.length == 0) {
    dispatch(
      initializeSimulationsToRun({
        pools: getState().simConfig.simulationLiquidityPools,
      })
    );
  }
};

function App() {
  const dispatch = useAppDispatch();
  const [loadHistoricPrices] = useLoadHistoricDailyPricesMutation();

  const loadPriceHistoryAsync = (): AppThunk => async (dispatch, getState) => {
    if (
      !getState().simConfig.coinPriceHistoryLoaded &&
      getState().simConfig.coinPriceHistoryLoadedStatus == 'pending'
    ) {
      dispatch(updateCoinPriceHistoryLoadedStatus('loading'));
      for (const coin of getState().simConfig.availableCoins) {
        const response = await loadHistoricPrices({
          coinCode: coin.coinCode,
        }).catch();
        dispatch(updateCoinLoadStatus('Daily ' + coin.coinCode + ' prices '));

        const fullPriceMap = new Map<number, CoinPrice>();

        const success = response as Success;
        const data = success.data || [];

        const dailyPriceHistory = data;

        data.forEach((element) => {
          fullPriceMap.set(element.unix, element);
        });

        const timesteps: Map<number, ReturnTimeStep> = new Map<
          number,
          ReturnTimeStep
        >();

        for (let i = 0; i < dailyPriceHistory.length; i++) {
          let returnVal = 0;

          if (i != 0) {
            returnVal =
              dailyPriceHistory[i].close / dailyPriceHistory[i - 1].close - 1;
          }

          timesteps.set(dailyPriceHistory[i].unix, {
            date: dailyPriceHistory[i].date,
            unix: dailyPriceHistory[i].unix,
            return: returnVal,
          });
        }

        dispatch(
          updateCoinPriceHistory({
            coinCode: coin.coinCode,
            coinName: coin.coinName,
            dailyPriceHistory: dailyPriceHistory,
            dailyPriceHistoryMap: fullPriceMap,
            dailyReturns: timesteps,
            coinComparisons: new Map<string, CoinComparison>(),
          })
        );
      }

      dispatch(updateCoinPriceHistoryLoaded(true));
      dispatch(updateCoinPriceHistoryLoadedStatus('loaded'));
    }
  };

  function initialisePage(page: string) {
    switch (page) {
      case 'simrunner': {
        dispatch(initialiseSimsToRun());
        break;
      }
    }

    dispatch(loadPriceHistoryAsync());
  }

  setTimeout(() => {
    dispatch(loadPriceHistoryAsync());
  }, 100);

  return (
    <AntDesignThemeProvider>
      <Layout className={style.app}>
        <Header style={{ padding: 0 }}>
          <MenuComponent initialise={initialisePage} />
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </AntDesignThemeProvider>
  );
}

export default App;
