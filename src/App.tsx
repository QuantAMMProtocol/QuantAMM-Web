import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { ModuleRegistry } from 'ag-grid-community';
import { EnterpriseCoreModule, LicenseManager } from 'ag-grid-enterprise';
import { AgCharts as AgChartsEnterprise } from 'ag-charts-enterprise';

import { useAppDispatch } from './app/hooks';
import { AppThunk } from './app/store';
import { initializeSimulationsToRun } from './features/simulationRunner/simulationRunnerSlice';
import { AntDesignThemeProvider } from './AntDesignThemeProvider';
import { MenuComponent } from './Menu';

import style from './app.module.scss';
import { loadPriceHistoryAsync } from './features/simulationRunner/SimulationHelper';

const { Content, Header } = Layout;

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
