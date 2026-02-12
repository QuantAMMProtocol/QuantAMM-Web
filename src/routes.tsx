import {
  About,
  ArbitrumMacroFactSheet,
  ArbitrumMacroSimulatorExample,
  BaseMacroFactSheet,
  BaseMacroSimulatorExample,
  CoinData,
  CompanyPage,
  ContactCompany,
  Documentation,
  IneligibleUser,
  LandingPage,
  ProductDetail,
  ProductExplorer,
  ProductHealthMonitor,
  Research,
  SafeHavenFactSheet,
  SafeHavenSimulatorExample,
  SimulationRunner,
  SimulationSavedResultComparison,
  SonicMacroFactSheet,
  SonicMacroSimulatorExample,
  TermsOfService,
  TruflationBitcoinFactSheet,
  TruflationBitcoinSimulatorExample,
} from './routeComponents';

import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ROUTES } from './routesEnum';
import RouteErrorBoundary from './routeErrorBoundary';

const BASE_ROUTE = '/';

export const routes = createBrowserRouter([
  {
    path: BASE_ROUTE,
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: ROUTES.HOME, element: <Navigate to={BASE_ROUTE} replace /> },

      {
        path: ROUTES.DOCUMENTATION,
        children: [
          { index: true, element: <Documentation /> },
          { path: ':id', element: <Documentation /> },
        ],
      },

      {
        path: ROUTES.PRODUCT_EXPLORER,
        children: [
          { index: true, element: <ProductExplorer /> },
          { path: ':chain/:id', element: <ProductDetail /> },
        ],
      },

      {
        path: `factsheet/${ROUTES.SAFEHAVENFACTSHEET}`,
        element: <SafeHavenFactSheet />,
      },
      {
        path: `factsheet/${ROUTES.BASEMACROFACTSHEET}`,
        element: <BaseMacroFactSheet />,
      },
      {
        path: `factsheet/${ROUTES.SONICMACROFACTSHEET}`,
        element: <SonicMacroFactSheet />,
      },
      {
        path: `factsheet/${ROUTES.ARBITRUMMACROFACTSHEET}`,
        element: <ArbitrumMacroFactSheet />,
      },
      {
        path: `factsheet/${ROUTES.TRUFLATIONBITCOINFACTSHEET}`,
        element: <TruflationBitcoinFactSheet />,
      },

      {
        path: `factsheet/example/${ROUTES.SAFEHAVENFACTSHEET}`,
        element: <SafeHavenSimulatorExample />,
      },
      {
        path: `factsheet/example/${ROUTES.BASEMACROFACTSHEET}`,
        element: <BaseMacroSimulatorExample />,
      },
      {
        path: `factsheet/example/${ROUTES.SONICMACROFACTSHEET}`,
        element: <SonicMacroSimulatorExample />,
      },
      {
        path: `factsheet/example/${ROUTES.ARBITRUMMACROFACTSHEET}`,
        element: <ArbitrumMacroSimulatorExample />,
      },
      {
        path: `factsheet/example/${ROUTES.TRUFLATIONBITCOINFACTSHEET}`,
        element: <TruflationBitcoinSimulatorExample />,
      },

      { path: ROUTES.EXAMPLES, element: <About /> },
      { path: ROUTES.COMPANY, element: <CompanyPage /> },
      { path: ROUTES.INELIGIBLEUSER, element: <IneligibleUser /> },
      { path: ROUTES.RESEARCH, element: <Research /> },
      { path: ROUTES.COINS, element: <CoinData /> },
      { path: ROUTES.CONTACT, element: <ContactCompany /> },
      { path: ROUTES.SIMULATION_RUNNER, element: <SimulationRunner /> },
      {
        path: ROUTES.SIMULATION_COMPARER,
        element: <SimulationSavedResultComparison />,
      },
      { path: ROUTES.TOS, element: <TermsOfService /> },
      { path: ROUTES.HEALTH_MONITOR, element: <ProductHealthMonitor /> },

      { path: '*', element: <Navigate to={BASE_ROUTE} replace /> },
    ],
  },
]);
