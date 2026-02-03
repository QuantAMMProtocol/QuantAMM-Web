import { Suspense, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { ModuleRegistry } from 'ag-grid-community';
import { EnterpriseCoreModule, LicenseManager } from 'ag-grid-enterprise';
import { AgCharts as AgChartsEnterprise } from 'ag-charts-enterprise';
import { batch } from 'react-redux';

import { useAppDispatch } from './app/hooks';
import { AppThunk } from './app/store';
import { initializeSimulationsToRun } from './features/simulationRunner/simulationRunnerSlice';
import { useLoadHistoricDailyPricesMutation } from './features/coinData/coinPriceRetrievalService';
import { CoinPrice } from './features/simulationRunConfiguration/simulationRunConfigModels';
import { ReturnTimeStep } from './features/simulationResults/simulationResultSummaryModels';
import {
  updateCoinPriceHistory,
  updateCoinPriceHistoryLoaded,
  updateCoinPriceHistoryLoadedStatus,
} from './features/simulationRunConfiguration/simulationRunConfigurationSlice';
import { AntDesignThemeProvider } from './AntDesignThemeProvider';
import { MenuComponent } from './Menu';
import { ROUTES } from './routesEnum';

import style from './app.module.scss';

const { Content, Header } = Layout;

const isRoute = (value: string): value is ROUTES =>
  (Object.values(ROUTES) as string[]).includes(value);

const AG_GRID_LICENSE_KEY = import.meta.env.AG_GRID_LICENCE_KEY ?? '';

const initialiseSimsToRun = (): AppThunk => (dispatch, getState) => {
  if (getState().simRunner.simulationsToRun.length === 0) {
    dispatch(
      initializeSimulationsToRun({
        pools: getState().simConfig.simulationLiquidityPools,
      })
    );
  }
};

ModuleRegistry.registerModules([EnterpriseCoreModule]);
LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);
AgChartsEnterprise.setLicenseKey(AG_GRID_LICENSE_KEY);

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loadHistoricPrices] = useLoadHistoricDailyPricesMutation();

  const loadPriceHistoryAsync = useCallback(
    (): AppThunk => async (dispatch, getState) => {
      const {
        availableCoins,
        coinPriceHistoryLoaded,
        coinPriceHistoryLoadedStatus,
      } = getState().simConfig;

      if (
        !coinPriceHistoryLoaded &&
        coinPriceHistoryLoadedStatus === 'pending'
      ) {
        dispatch(updateCoinPriceHistoryLoadedStatus('loading'));

        try {
          // 1) Fire off all the requests in parallel
          const promises = availableCoins.map(async (coin) => {
            const data = await loadHistoricPrices({
              coinCode: coin.coinCode,
            }).unwrap();

            const fullPriceMap = new Map<number, CoinPrice>();
            const timesteps = new Map<number, ReturnTimeStep>();

            data.forEach((p, i) => {
              fullPriceMap.set(p.unix, p);
              const ret = i === 0 ? 0 : p.close / data[i - 1].close - 1;
              timesteps.set(p.unix, {
                date: p.date,
                unix: p.unix,
                return: ret,
              });
            });

            return {
              coin,
              dailyPriceHistory: data,
              dailyPriceHistoryMap: fullPriceMap,
              dailyReturns: timesteps,
            };
          });

          const results = await Promise.all(promises);

          batch(() => {
            results.forEach(
              ({
                coin,
                dailyPriceHistory,
                dailyPriceHistoryMap,
                dailyReturns,
              }) => {
                dispatch(
                  updateCoinPriceHistory({
                    coinCode: coin.coinCode,
                    coinName: coin.coinName,
                    dailyPriceHistory,
                    dailyPriceHistoryMap,
                    dailyReturns,
                    coinComparisons: new Map(),
                    deploymentByChain: coin.deploymentByChain,
                  })
                );
              }
            );
            dispatch(updateCoinPriceHistoryLoaded(true));
            dispatch(updateCoinPriceHistoryLoadedStatus('loaded'));
          });
        } catch (e) {
          dispatch(updateCoinPriceHistoryLoadedStatus('pending'));
          throw e;
        }
      }
    },
    [loadHistoricPrices]
  );

  const initialisePage = useCallback(
    (page: string) => {
      if (!isRoute(page)) {
        return;
      }

      if (page === ROUTES.SIMULATION_RUNNER) {
        dispatch(initialiseSimsToRun());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(loadPriceHistoryAsync());
  }, [dispatch, loadPriceHistoryAsync]);

  useEffect(() => {
    const segment = location.pathname.split('/')[1] ?? '';
    const page = isRoute(segment) ? segment : ROUTES.HOME;
    initialisePage(page);
  }, [location.pathname, initialisePage]);

  return (
    <AntDesignThemeProvider>
      <Layout className={style.app}>
        <Header style={{ padding: 0, height: 'auto' }}>
          <MenuComponent initialise={initialisePage} />
        </Header>
        <Content>
          <Suspense fallback={<div />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </AntDesignThemeProvider>
  );
}

export default App;
