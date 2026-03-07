import {
  selectSimulationRunBreakdowns,
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerCurrentRunTypeIndex,
  selectSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
  importSimRunResults,
  resetSimulationRunner,
} from './simulationRunnerSlice';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { message } from 'antd';
import { useGetPoolByIdLazyQuery } from '../../__generated__/graphql-types';
import { Benchmark, Product, TimeSeriesData } from '../../models';
import { useRunFinancialAnalysisMutation } from '../../services';
import { loadProducts } from '../productExplorer/productExplorerSlice';
import { SimulationResultAnalysisDto } from '../simulationRunner/simulationRunnerDtos';
import { resetSims } from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { LiquidityPoolCoin } from '../simulationRunConfiguration/simulationRunConfigModels';
import { SimulationRunnerTimePeriodStep } from './simulationRunnerTimePeriodStep';
import { SimulationRunnerHookTimePeriodStep } from './simulationRunnerHookTimePeriodStep';
import { handleDownloadResults, handleDownloadParams } from './index';
import { getBreakdown } from '../../services/breakdownService';
import { generateProductDataFromPoolData } from '../../hooks/useGenerateProductDataFromPool';

import { SimulationRunnerFinalReviewStep } from './simulationRunnerFinalReviewStep';
import { SimulationResultsSummaryStep } from '../simulationResults/simulationResultsSummaryStep';
import { SimulationResultSaveToCompareTab } from '../simulationResults/simulationResultSaveToCompareTab';
import { SimulationRunnerHistoricInProgress } from './simulationRunnerHistoricInProgress';
import {
  SimulationRunBreakdown,
  SimulationRunLiquidityPoolSnapshot,
} from '../simulationResults/simulationResultSummaryModels';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { SimulatorOptions } from './simulationOptions';
import TrainBtfInProgress from '../trainBtf/trainBtfInProgress';
import { PoolConstituentSelectionStep } from './sections/poolConstituentSelectionStep';
import { SimulationRunnerHeader } from './sections/simulationRunnerHeader';
import {
  LivePoolSelection,
  SimulationRunnerImportResultsModal,
} from './sections/simulationRunnerImportResultsModal';
import { CURRENT_LIVE_FACTSHEETS } from '../documentation/factSheets/liveFactsheets';
import { Chain } from '../simulationRunConfiguration/simulationRunConfigModels';

const formatSimulationRangeDate = (timestamp: number): string => {
  if (!timestamp) {
    return '';
  }

  return new Date(timestamp * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
};

const buildPortfolioReturnsForAnalysis = (timeSeries: TimeSeriesData[]) =>
  timeSeries
    .map((step, i) => {
      if (i === 0) {
        return [step.timestamp * 1000, 0, 0] as [number, number, number];
      }

      const prevStep = timeSeries[i - 1];
      if (!prevStep) {
        return null;
      }

      const portfolioReturn =
        (step.sharePrice - prevStep.sharePrice) / prevStep.sharePrice;
      const hodlReturn =
        (step.hodlSharePrice - prevStep.hodlSharePrice) /
        prevStep.hodlSharePrice;

      return [step.timestamp * 1000, portfolioReturn, hodlReturn] as [
        number,
        number,
        number,
      ];
    })
    .filter(
      (portfolioReturn): portfolioReturn is [number, number, number] =>
        portfolioReturn !== null
    );

const buildSyntheticSnapshotsFromProduct = (
  product: Product
): SimulationRunLiquidityPoolSnapshot[] => {
  const timeSeries = product.timeSeries ?? [];

  return timeSeries.map((step) => {
    const tokenInputs = product.poolConstituents.map((constituent, index) => {
      const tokenAmount = step.amounts[index] ?? 0;
      const tokenPrice =
        step.tokenPrices[constituent.address] ??
        step.tokenPrices[constituent.address.toLowerCase()] ??
        step.tokenPriceArray[index] ??
        0;

      return {
        constituent,
        tokenAmount,
        tokenPrice,
        marketValue: tokenAmount * tokenPrice,
      };
    });

    const totalByTokenValue = tokenInputs.reduce(
      (sum, tokenInput) => sum + tokenInput.marketValue,
      0
    );
    const weightDenominator =
      totalByTokenValue > 0
        ? totalByTokenValue
        : step.totalLiquidity > 0
          ? step.totalLiquidity
          : 1;

    const coinsHeld: LiquidityPoolCoin[] = tokenInputs.map((tokenInput) => ({
      coin: {
        coinName: tokenInput.constituent.coin,
        coinCode: tokenInput.constituent.coin,
        dailyPriceHistory: [],
        dailyPriceHistoryMap: new Map(),
        dailyReturns: new Map(),
        coinComparisons: new Map(),
        deploymentByChain: new Map<
          Chain,
          {
            address: string;
            oracles: Map<string, string>;
            approvalStatus: boolean;
          }
        >(),
      },
      amount: tokenInput.tokenAmount,
      marketValue: tokenInput.marketValue,
      currentPrice: tokenInput.tokenPrice,
      currentPriceUnix: step.timestamp,
      weight: (tokenInput.marketValue / weightDenominator) * 100,
      factorValue: null,
    }));

    return {
      unix: step.timestamp,
      date: new Date(step.timestamp * 1000).toISOString(),
      coinsHeld,
      feeForSnapshot: step.fees24h ?? 0,
      hodlEquiv: undefined,
      totalFeesReceivedToDate: 0,
      totalPoolMarketValue:
        step.sharePrice > 0 ? step.sharePrice : totalByTokenValue,
    };
  });
};

const buildLiveProductBreakdown = ({
  product,
  analysis,
}: {
  product: Product;
  analysis: SimulationResultAnalysisDto;
}): SimulationRunBreakdown => {
  const syntheticTimeSteps = buildSyntheticSnapshotsFromProduct(product);
  const firstTimeStep = syntheticTimeSteps[0];
  const lastTimeStep = syntheticTimeSteps[syntheticTimeSteps.length - 1];

  return {
    simulationRunResultAnalysis: analysis,
    simulationRun: {
      id: product.id,
      enableAutomaticArbBots: false,
      poolNumeraireCoinCode: '',
      poolConstituents: firstTimeStep?.coinsHeld ?? [],
      updateRule: {
        updateRuleName: product.name,
        updateRuleKey: product.id,
        updateRuleParameters: [],
        updateRuleResultProfileSummary: '',
        heatmapKeys: [],
        updateRuleRunUrl: '',
        updateRuleTrainUrl: '',
        updateRuleSimKey: '',
        applicablePoolTypes: [],
        chainDeploymentDetails: new Map(),
      },
      runStatus: 'completed',
      name: product.name,
      feeHooks: [],
      swapImports: [],
      poolType: {
        name: 'LIVE',
        mandatoryProperties: [],
        shortDescription: 'live product pool',
        requiresPoolNumeraire: false,
      },
    },
    flatSimulationRunResult: undefined,
    simulationRunStatus: 'Complete',
    simulationComplete: true,
    timeSteps: syntheticTimeSteps,
    timeRange: {
      name: 'live',
      startDate: formatSimulationRangeDate(firstTimeStep?.unix ?? 0),
      endDate: formatSimulationRangeDate(lastTimeStep?.unix ?? 0),
    },
  };
};

export default function SimulationRunner() {
  const dispatch = useAppDispatch();
  const [getPoolById] = useGetPoolByIdLazyQuery();
  const [runFinancialAnalysis] = useRunFinancialAnalysisMutation();

  const results = useAppSelector(selectSimulationRunBreakdowns);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const runTypeIndex = useAppSelector(
    selectSimulationRunnerCurrentRunTypeIndex
  );

  const currentStepIndex = useAppSelector(
    selectSimulationRunnerCurrentStepIndex
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceViewResults, setForceViewResults] = useState(false);
  const [importingLivePool, setImportingLivePool] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onChange = useCallback(
    (value: number) => {
      if (value === 5 && runStatusIndex !== 2) {
        return;
      }

      dispatch(changeSimulationRunnerCurrentStepIndex(value));
    },
    [dispatch, runStatusIndex]
  );

  const paramsFileInputRef = useRef<HTMLInputElement>(null);
  const resultsFileInputRef = useRef<HTMLInputElement>(null);

  const handleParamsImportClick = useCallback(() => {
    paramsFileInputRef.current?.click();
  }, []);

  const handleResultsImportClick = useCallback(() => {
    resultsFileInputRef.current?.click();
  }, []);

  const handleResetClick = useCallback(() => {
    dispatch(resetSimulationRunner());
    dispatch(resetSims());
    dispatch(changeSimulationRunnerCurrentStepIndex(0));
    dispatch(changeSimulationRunnerCurrentRunTypeIndex(0));
  }, [dispatch]);

  const handleParamsFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => handleDownloadParams(event, dispatch),
    [dispatch]
  );

  const handleResultsFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      handleDownloadResults(event, dispatch, setForceViewResults),
    [dispatch]
  );

  const handleLivePoolImport = useCallback(
    async (pool: LivePoolSelection) => {
      if (runStatusIndex !== 2 || importingLivePool) {
        return;
      }

      setImportingLivePool(true);

      try {
        const poolQueryResult = await getPoolById({
          variables: {
            id: pool.id,
            chain: pool.chain,
          },
          fetchPolicy: 'network-only',
        });

        if (!poolQueryResult.data?.poolGetPool?.id) {
          void message.error('Unable to load live pool data.');
          return;
        }

        const product = await generateProductDataFromPoolData(
          poolQueryResult.data
        );

        dispatch(loadProducts({ [product.id]: product }));

        const productAddress = product.address?.toLowerCase() ?? '';
        const productId = product.id?.toLowerCase() ?? '';

        const matchedFactsheet = CURRENT_LIVE_FACTSHEETS.factsheets.find(
          (factsheet) => {
            const factsheetPoolId = factsheet.poolId.toLowerCase();
            return (
              factsheetPoolId === productAddress || factsheetPoolId === productId
            );
          }
        );

        let importedBreakdown: SimulationRunBreakdown | undefined;

        if (matchedFactsheet?.targetPoolJson) {
          importedBreakdown = await getBreakdown(matchedFactsheet.targetPoolJson);
        } else {
          const timeSeries = product.timeSeries ?? [];
          if (timeSeries.length < 2) {
            void message.error(
              'Not enough historical data to import this live pool.'
            );
            return;
          }

          const startTimestamp = timeSeries[0]?.timestamp;
          const endTimestamp = timeSeries[timeSeries.length - 1]?.timestamp;

          const analysisResult = await runFinancialAnalysis({
            request: {
              startDateString: startTimestamp
                ? new Date(startTimestamp * 1000).toLocaleString()
                : '',
              endDateString: endTimestamp
                ? new Date(endTimestamp * 1000).toLocaleString()
                : '',
              tokens: [...new Set(product.poolConstituents.map((pc) => pc.coin))],
              returns: buildPortfolioReturnsForAnalysis(timeSeries),
              benchmarks: [Benchmark.HODL],
            },
          });

          if (!('data' in analysisResult) || !analysisResult.data?.analysis) {
            void message.error(
              'Unable to calculate analysis for the selected live pool.'
            );
            return;
          }

          importedBreakdown = buildLiveProductBreakdown({
            product,
            analysis: analysisResult.data.analysis,
          });
        }

        if (!importedBreakdown) {
          return;
        }

        dispatch(
          importSimRunResults({
            simulationRunner: importedBreakdown,
          })
        );

        setForceViewResults(true);
        dispatch(changeSimulationRunnerCurrentStepIndex(6));
        setIsModalOpen(false);
        void message.success(`Imported live pool: ${pool.name}`);
      } catch (error) {
        console.error('Error importing live pool:', error);
        void message.error('Failed to import live pool results.');
      } finally {
        setImportingLivePool(false);
      }
    },
    [dispatch, getPoolById, importingLivePool, runFinancialAnalysis, runStatusIndex]
  );

  function getRunnerStep(): JSX.Element {
    switch (currentStepIndex) {
      case 0:
        return <SimulatorOptions />;
      case 1:
        return <PoolConstituentSelectionStep />;
      case 2:
        return <SimulationRunnerTimePeriodStep />;
      case 3:
        return <SimulationRunnerHookTimePeriodStep />;
      case 4:
        return <SimulationRunnerFinalReviewStep />;
      case 5:
        if (runTypeIndex === 1) {
          return <SimulationRunnerHistoricInProgress />;
        } else if (runTypeIndex === 2) {
          return <TrainBtfInProgress />;
        } else {
          return <SimulationRunnerFinalReviewStep />;
        }
      case 6:
        return (
          <SimulationResultsSummaryStep
            breakdowns={results}
            forceViewResults={forceViewResults}
          />
        );
      case 7:
        return (
          <SimulationResultSaveToCompareTab
            breakdowns={results}
            forceViewResults={false}
          />
        );
      default:
        return <div />;
    }
  }

  return (
    <div>
      <SimulationRunnerHeader
        currentStepIndex={currentStepIndex}
        runStatusIndex={runStatusIndex}
        onChange={onChange}
        onImportClick={showModal}
        onResetClick={handleResetClick}
      />

      <SimulationRunnerImportResultsModal
        isOpen={isModalOpen}
        runStatusIndex={runStatusIndex}
        importingLivePool={importingLivePool}
        onClose={closeModal}
        paramsFileInputRef={paramsFileInputRef}
        resultsFileInputRef={resultsFileInputRef}
        onParamsImportClick={handleParamsImportClick}
        onResultsImportClick={handleResultsImportClick}
        onLivePoolImport={handleLivePoolImport}
        onParamsFileChange={handleParamsFileChange}
        onResultsFileChange={handleResultsFileChange}
      />

      {getRunnerStep()}
    </div>
  );
}

export { SimulationRunner };
