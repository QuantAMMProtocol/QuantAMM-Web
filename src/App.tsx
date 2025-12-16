import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { ModuleRegistry } from 'ag-grid-community';
import { EnterpriseCoreModule, LicenseManager } from 'ag-grid-enterprise';
import { AgCharts as AgChartsEnterprise } from 'ag-charts-enterprise';
import { useAppDispatch } from './app/hooks';
import { AppThunk } from './app/store';
import { initializeSimulationsToRun } from './features/simulationRunner/simulationRunnerSlice';
import { useLoadHistoricDailyPricesMutation } from './features/coinData/coinPriceRetrievalService';
import {
  CoinPrice,
} from './features/simulationRunConfiguration/simulationRunConfigModels';
import { ReturnTimeStep } from './features/simulationResults/simulationResultSummaryModels';
import {
  updateCoinPriceHistory,
  updateCoinPriceHistoryLoaded,
  updateCoinPriceHistoryLoadedStatus,
} from './features/simulationRunConfiguration/simulationRunConfigurationSlice';
import { AntDesignThemeProvider } from './AntDesignThemeProvider';
import { MenuComponent } from './Menu';

import style from './app.module.scss';
import { batch } from 'react-redux';

export interface Success {
  data: CoinPrice[];
}

const { Content, Header } = Layout;

// TODO: Remove and put in .env
const AG_GRID_LICENSE_KEY =
  'Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-076103}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Robo_Inc.}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{QuantAMM_APP}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{QuantAMM_APP}_need_to_be_licensed___{QuantAMM_APP}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{30_January_2026}____[v3]_[0102]_MTc2OTczMTIwMDAwMA==45158aeb0ade13e0a121e419751d0010';

const initialiseSimsToRun = (): AppThunk => (dispatch, getState) => {
  if (getState().simRunner.simulationsToRun.length == 0) {
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
  const [loadHistoricPrices] = useLoadHistoricDailyPricesMutation();

  const loadPriceHistoryAsync = (): AppThunk => async (dispatch, getState) => {
    const {
      availableCoins,
      coinPriceHistoryLoaded,
      coinPriceHistoryLoadedStatus,
    } = getState().simConfig;

    if (!coinPriceHistoryLoaded && coinPriceHistoryLoadedStatus === 'pending') {
      dispatch(updateCoinPriceHistoryLoadedStatus('loading'));

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
          timesteps.set(p.unix, { date: p.date, unix: p.unix, return: ret });
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
          ({ coin, dailyPriceHistory, dailyPriceHistoryMap, dailyReturns }) => {
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
        <Header style={{ padding: 0, height: 'auto' }}>
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
