import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import { CoinData } from './features/coinData/coinData';
import { SimulationRunner } from './features/simulationRunner/simulationRunner';
import { ProductDetail, ProductExplorer } from './features';
import { About } from './features/documentation/about';
import { Documentation } from './features/documentation/documentation';
import { SimulationSavedResultComparison } from './features/simulationResults/resultComparisonTab/simulationSavedResultComparison';
import { ROUTES } from './routesEnum';
import LandingPage from './features/documentation/landing/landingPage';
import { Research } from './features/documentation/research';
import { CompanyPage } from './features/documentation/company';
import { ContactCompany } from './features/documentation/landing/desktop/contactCompany';
import TermsOfService from './features/documentation/landing/termsOfService';
import { SafeHavenFactSheet } from './features/documentation/factSheets/safeHaven';

const BASE_ROUTE = '/';

export const routes = createBrowserRouter([
  {
    path: BASE_ROUTE,
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: ROUTES.HOME,
        element: <Navigate to={BASE_ROUTE} replace />,
      },
      {
        path: ROUTES.DOCUMENTATION,
        children: [
          {
            index: true,
            element: <Documentation />,
          },
          {
            path: ':id',
            element: <Documentation />,
          },
        ],
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
        path: 'factsheet/' + ROUTES.SAFEHAVENFACTSHEET,
        element:<SafeHavenFactSheet />,
      },
      {
        path: ROUTES.EXAMPLES,
        element: <About />,
      },
      {
        path: ROUTES.COMPANY,
        element: <CompanyPage />,
      },
      {
        path: ROUTES.RESEARCH,
        element: <Research />,
      },
      {
        path: ROUTES.COINS,
        element: <CoinData />,
      },
      {
        path:ROUTES.CONTACT,
        element: <ContactCompany />
      },
      {
        path: ROUTES.SIMULATION_RUNNER,
        element: <SimulationRunner />,
      },
      {
        path: ROUTES.SIMULATION_COMPARER,
        element: <SimulationSavedResultComparison />,
      },
      {
        path: ROUTES.TOS,
        element: <TermsOfService />,
      }
    ],
  },
]);
