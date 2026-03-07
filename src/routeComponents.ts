import { lazy } from 'react';

export const CoinData = lazy(() => import('./features/coinData/coinData'));
export const SimulationRunner = lazy(
  () => import('./features/simulationRunner/simulationRunner')
);
export const TrainBtfWorkflow = lazy(
  () => import('./features/trainBtf/trainBtfWorkflow')
);
export const TrainBtfInProgress = lazy(
  () => import('./features/trainBtf/trainBtfInProgress')
);
export const TrainBtfResults = lazy(
  () => import('./features/trainBtf/trainBtfResults')
);

export const ProductExplorer = lazy(
  () => import('./features/productExplorer/productExplorer')
);
export const ProductDetail = lazy(
  () => import('./features/productDetail/productDetail')
);

export const About = lazy(() => import('./features/documentation/about'));
export const Documentation = lazy(
  () => import('./features/documentation/documentation')
);

export const SimulationSavedResultComparison = lazy(
  () =>
    import(
      './features/simulationResults/resultComparisonTab/simulationSavedResultComparison'
    )
);

export const LandingPage = lazy(
  () => import('./features/documentation/landing/landingPage')
);
export const Research = lazy(() => import('./features/documentation/research'));
export const CompanyPage = lazy(
  () => import('./features/documentation/company')
);
export const ContactCompany = lazy(
  () => import('./features/documentation/landing/desktop/contactCompany')
);

export const TermsOfService = lazy(
  () => import('./features/documentation/landing/newTermsOfService')
);
export const IneligibleUser = lazy(
  () => import('./features/documentation/landing/IneligableUserLanding')
);

export const SafeHavenFactSheet = lazy(
  () => import('./features/documentation/factSheets/safeHaven/safeHaven')
);
export const BaseMacroFactSheet = lazy(
  () => import('./features/documentation/factSheets/baseMacro/baseMacro')
);
export const SonicMacroFactSheet = lazy(
  () => import('./features/documentation/factSheets/sonicMacro/sonicMacro')
);
export const ArbitrumMacroFactSheet = lazy(
  () =>
    import('./features/documentation/factSheets/arbitrumMacro/arbitrumMacro')
);
export const TruflationBitcoinFactSheet = lazy(
  () =>
    import(
      './features/documentation/factSheets/truflationBitcoin/truflationBitcoin'
    )
);

export const SafeHavenSimulatorExample = lazy(
  () => import('./features/documentation/factSheets/safeHaven/safeHavenSimView')
);
export const BaseMacroSimulatorExample = lazy(
  () => import('./features/documentation/factSheets/baseMacro/baseMacroSimView')
);
export const SonicMacroSimulatorExample = lazy(
  () =>
    import('./features/documentation/factSheets/sonicMacro/sonicMacroSimView')
);
export const ArbitrumMacroSimulatorExample = lazy(
  () =>
    import(
      './features/documentation/factSheets/arbitrumMacro/arbitrumMacroSimView'
    )
);
export const TruflationBitcoinSimulatorExample = lazy(
  () =>
    import(
      './features/documentation/factSheets/truflationBitcoin/truflationBitcoinSimView'
    )
);

export const ProductHealthMonitor = lazy(
  () => import('./features/productExplorer/productHealthMonitor')
);
