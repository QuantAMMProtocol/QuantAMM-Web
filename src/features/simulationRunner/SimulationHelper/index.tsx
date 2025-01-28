import React, { ChangeEvent, Dispatch } from 'react';
import { AppThunk } from '../../../app/store';
import {
  generateAndAddPoolToSim,
  setDateRange,
  setEndDate,
  setStartDate,
  updateCoinLoadStatus,
  updateCoinPriceHistory,
  updateCoinPriceHistoryLoaded,
  updateCoinPriceHistoryLoadedStatus,
} from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import {
  importSimRunResults,
  changeSimulationRunnerCurrentStepIndex,
  updateStatus,
} from './../simulationRunnerSlice';
import { useLoadHistoricDailyPricesMutation } from '../../coinData/coinPriceRetrievalService';
import {
  CoinComparison,
  CoinPrice,
} from '../../simulationRunConfiguration/simulationRunConfigModels';
import { ReturnTimeStep } from '../../simulationResults/simulationResultSummaryModels';

interface Success {
  data: CoinPrice[];
}

export const loadPriceHistoryAsync =
  (): AppThunk => async (dispatch, getState) => {
    const [loadHistoricPrices] = useLoadHistoricDailyPricesMutation();
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
  };

export const handleDownloadParams = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch<any>
) => {
  const file = event.target.files?.[0];

  if (file && file.type === 'application/json') {
    // Ensure it's a JSON file
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const jsonContent = loadEvent.target?.result;
      try {
        const jsonData = JSON.parse(jsonContent as string);
        dispatch(loadPriceHistoryAsync());
        dispatch(updateCoinPriceHistoryLoaded(false));
        dispatch(updateCoinPriceHistoryLoadedStatus('pending'));
        // Dispatch actions to set initial state elements

        // Example updates based on your state structure, customize as needed
        dispatch(setStartDate(jsonData.timeRange.startDate));
        dispatch(setEndDate(jsonData.timeRange.endDate));
        dispatch(
          setDateRange({
            startDate: jsonData.timeRange.startDate,
            endDate: jsonData.timeRange.endDate,
          })
        );

        // New slice dispatches
        dispatch(updateStatus('Pending'));

        dispatch(
          generateAndAddPoolToSim({
            updateRule: {
              updateRuleName: jsonData.simulationRun.updateRule.updateRuleName,
              updateRuleKey: jsonData.simulationRun.updateRule.updateRuleKey,
              updateRuleSimKey:
                jsonData.simulationRun.updateRule.updateRuleSimKey,
              updateRuleRunUrl: undefined,
              updateRuleTrainUrl: undefined,
              updateRuleResultProfileSummary:
                'Returns are the change in price relative to the intial reserves',
              heatmapKeys: [],
              updateRuleParameters: [],
              applicablePoolTypes:
                jsonData.simulationRun.updateRule.applicablePoolTypes,
            },
            poolConstituents: jsonData.simulationRun.poolConstituents,
            poolType: jsonData.simulationRun.poolType,
            id: '',
            enableAutomaticArbBots:
              jsonData.simulationRun.enableAutomaticArbBots,
          })
        );
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
      alert('Error reading the file.');
    };

    reader.readAsText(file); // Read the file as a text string
  } else {
    alert('Please upload a valid JSON file.');
  }

  dispatch(changeSimulationRunnerCurrentStepIndex(5));
};

export const handleDownloadResults = (
  event: React.ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch<any>,
  setForceViewResults: (value: boolean) => void
) => {
  const file = event.target.files?.[0];

  if (file && file.type === 'application/json') {
    // Ensure it's a JSON file
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const jsonContent = loadEvent.target?.result;
      try {
        const jsonData = JSON.parse(jsonContent as string);

        dispatch(
          importSimRunResults({
            simulationRunner: {
              simulationRun: jsonData.simulationRun,
              flatSimulationRunResult: undefined,
              simulationRunStatus: jsonData.simulationRunStatus,
              simulationComplete: jsonData.simulationComplete,
              timeSteps: jsonData.timeSteps,
              timeRange: jsonData.timeRange,
              simulationRunResultAnalysis: jsonData.simulationRunResultAnalysis,
            },
          })
        );
        setForceViewResults(true);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the file format.');
        setForceViewResults(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
      alert('Error reading the file.');
      setForceViewResults(false);
    };

    reader.readAsText(file); // Read the file as a text string
  } else {
    alert('Please upload a valid JSON file.');
    setForceViewResults(false);
  }

  dispatch(changeSimulationRunnerCurrentStepIndex(6));
};

export const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  dispatch: any,
  loadPriceHistoryAsync: () => AppThunk,
  setForceViewResults?: (value: boolean) => void
) => {
  const file = event.target.files?.[0];

  if (file && file.type === 'application/json') {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const jsonContent = loadEvent.target?.result;
      try {
        const jsonData = JSON.parse(jsonContent as string);
        if (setForceViewResults) {
          dispatch(
            importSimRunResults({
              simulationRunner: {
                simulationRun: jsonData.simulationRun,
                simulationRunResultAnalysis:
                  jsonData.simulationRunResultAnalysis,
                flatSimulationRunResult: undefined,
                simulationRunStatus: jsonData.simulationRunStatus,
                simulationComplete: jsonData.simulationComplete,
                timeSteps: jsonData.timeSteps,
                timeRange: jsonData.timeRange,
              },
            })
          );
          setForceViewResults(true);
        } else {
          dispatch(loadPriceHistoryAsync());
          dispatch(updateCoinPriceHistoryLoaded(false));
          dispatch(updateCoinPriceHistoryLoadedStatus('pending'));
          // Example updates based on your state structure, customize as needed
          dispatch(setStartDate(jsonData.timeRange.startDate));
          dispatch(setEndDate(jsonData.timeRange.endDate));
          dispatch(
            setDateRange({
              startDate: jsonData.timeRange.startDate,
              endDate: jsonData.timeRange.endDate,
            })
          );
          dispatch(updateStatus('Pending'));
          dispatch(
            generateAndAddPoolToSim({
              updateRule: {
                updateRuleName: 'HODL',
                updateRuleKey: 'HODL',
                updateRuleSimKey: 'HODL',
                updateRuleRunUrl: undefined,
                updateRuleTrainUrl: undefined,
                updateRuleResultProfileSummary:
                  'Returns are the change in price relative to the initial reserves',
                heatmapKeys: [],
                updateRuleParameters: [],
                applicablePoolTypes: [],
              },
              poolConstituents: jsonData.simulationRun.poolConstituents,
              poolType: {
                name: 'HODL',
                shortDesciption: 'HODL',
                longDescription: 'HODL',
                mandatoryProperties: [],
                requiresPoolNumeraire: false,
              },
              enableAutomaticArbBots: false,
              id: '',
            })
          );
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the file format.');
        if (setForceViewResults) setForceViewResults(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
      alert('Error reading the file.');
      if (setForceViewResults) setForceViewResults(false);
    };

    reader.readAsText(file);
  } else {
    alert('Please upload a valid JSON file.');
    if (setForceViewResults) setForceViewResults(false);
  }
};
