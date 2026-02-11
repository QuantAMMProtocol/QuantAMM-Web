import { ChangeEvent } from 'react';
import { AppDispatch } from '../../../app/store';
import {
  generateAndAddPoolToSim,
  setDateRange,
  setEndDate,
  setStartDate,
  updateCoinPriceHistoryLoaded,
  updateCoinPriceHistoryLoadedStatus,
} from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import {
  importSimRunResults,
  changeSimulationRunnerCurrentStepIndex,
  updateStatus,
} from './../simulationRunnerSlice';
import { Chain } from '../../simulationRunConfiguration/simulationRunConfigModels';
import { loadPriceHistoryAsync } from '../../coinData/loadPriceHistoryThunk';

const isJsonFile = (file: File) =>
  file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');

export const handleDownloadParams = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch
) => {
  const file = event.target.files?.[0];

  if (file && isJsonFile(file)) {
    // Ensure it's a JSON file
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const jsonContent = loadEvent.target?.result;
      try {
        const jsonData = JSON.parse(jsonContent as string);
        dispatch(updateCoinPriceHistoryLoaded(false));
        dispatch(updateCoinPriceHistoryLoadedStatus('pending'));
        dispatch(loadPriceHistoryAsync({ includePerCoinLoadStatus: true }));
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
              chainDeploymentDetails:
                jsonData.simulationRun.updateRule.chainDeploymentDetails,
            },
            poolConstituents: jsonData.simulationRun.poolConstituents,
            poolType: jsonData.simulationRun.poolType,
            id: '',
            enableAutomaticArbBots:
              jsonData.simulationRun.enableAutomaticArbBots,
          })
        );
        dispatch(changeSimulationRunnerCurrentStepIndex(5));
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
};

export const handleDownloadResults = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch,
  setForceViewResults: (value: boolean) => void
) => {
  const file = event.target.files?.[0];

  if (file && isJsonFile(file)) {
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
        dispatch(changeSimulationRunnerCurrentStepIndex(6));
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
};

export const handleFileChange = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch,
  setForceViewResults?: (value: boolean) => void
) => {
  const file = event.target.files?.[0];

  if (file && isJsonFile(file)) {
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
          dispatch(updateCoinPriceHistoryLoaded(false));
          dispatch(updateCoinPriceHistoryLoadedStatus('pending'));
          dispatch(loadPriceHistoryAsync({ includePerCoinLoadStatus: true }));
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
                chainDeploymentDetails: new Map<Chain, string>(),
              },
              poolConstituents: jsonData.simulationRun.poolConstituents,
              poolType: {
                name: 'HODL',
                shortDescription: 'HODL',
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
