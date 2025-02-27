import { Navigate, createBrowserRouter } from 'react-router-dom';
import { INITIAL_LOAD_POOLS_COUNT } from './models/constants';
import App from './App';
import { CoinData } from './features/coinData/coinData';
import { SimulationRunner } from './features/simulationRunner/simulationRunner';
import { ProductDetail, ProductExplorer } from './features';
import { About } from './features/documentation/about';
import { Documentation } from './features/documentation/documentation';
import { SimulationSavedResultComparison } from './features/simulationResults/resultComparisonTab/simulationSavedResultComparison';
import { ROUTES } from './routesEnum';

const BASE_ROUTE = '/';

export const routes = createBrowserRouter([
  {
    path: BASE_ROUTE,
    element: <App />,
    children: [
      {
        index: true,
        element: <SimulationRunner poolsToLoad={INITIAL_LOAD_POOLS_COUNT} />,
      },
      {
        path: ROUTES.HOME,
        element: <Navigate to={BASE_ROUTE} replace />,
      },
      {
        path: ROUTES.DOCUMENTATION,
        element: <Documentation />,
      },
      {
        path: ROUTES.PRODUCT_EXPLORER,
        children: [
          {
            index: true,
            element: <ProductExplorer />,
          },
          {
            path: ':chain/:id',
            element: <ProductDetail />,
          },
        ],
      },
      {
        path: ROUTES.EXAMPLES,
        element: <About />,
      },
      {
        path: ROUTES.COINS,
        element: <CoinData />,
      },
      {
        path: ROUTES.SIMULATION_RUNNER,
        element: <SimulationRunner poolsToLoad={INITIAL_LOAD_POOLS_COUNT} />,
      },
      {
        path: ROUTES.SIMULATION_COMPARER,
        element: <SimulationSavedResultComparison />,
      },
    ],
  },
]);
