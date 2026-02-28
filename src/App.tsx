import { Suspense, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { ModuleRegistry } from 'ag-grid-community';
import { EnterpriseCoreModule, LicenseManager } from 'ag-grid-enterprise';
import { AgCharts as AgChartsEnterprise } from 'ag-charts-enterprise';

import { useAppDispatch } from './app/hooks';
import { AppThunk } from './app/store';
import { initializeSimulationsToRun } from './features/simulationRunner/simulationRunnerSlice';
import { AntDesignThemeProvider } from './AntDesignThemeProvider';
import { MenuComponent } from './Menu';
import { ROUTES } from './routesEnum';

import style from './app.module.scss';
import { loadPriceHistoryAsync } from './features/coinData/loadPriceHistoryThunk';

const { Content, Header } = Layout;

const isRoute = (value: string): value is ROUTES =>
  (Object.values(ROUTES) as string[]).includes(value);

const AG_GRID_LICENSE_KEY = import.meta.env.VITE_AG_GRID_LICENSE_KEY ?? '';

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

  const initialisePage = useCallback(
    (page: string) => {
      if (!isRoute(page)) {
        return;
      }

      if (page !== ROUTES.SIMULATION_RUNNER) {
        dispatch(loadPriceHistoryAsync());
        dispatch(initialiseSimsToRun());
      }
    },
    [dispatch]
  );

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
