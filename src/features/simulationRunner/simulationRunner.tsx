import {
  selectSimulationRunBreakdowns,
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerCurrentRunTypeIndex,
  selectSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
  resetSimulationRunner,
} from './simulationRunnerSlice';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  resetSims,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationRunnerTimePeriodStep } from './simulationRunnerTimePeriodStep';
import { SimulationRunnerHookTimePeriodStep } from './simulationRunnerHookTimePeriodStep';
import {
  handleDownloadResults,
  handleDownloadParams,
} from './index';

import { SimulationRunnerFinalReviewStep } from './simulationRunnerFinalReviewStep';
import { SimulationResultsSummaryStep } from '../simulationResults/simulationResultsSummaryStep';
import { SimulationResultSaveToCompareTab } from '../simulationResults/simulationResultSaveToCompareTab';
import { SimulationRunnerHistoricInProgress } from './simulationRunnerHistoricInProgress';
import { useRef, useState } from 'react';
import { SimulatorOptions } from './simulationOptions';
import { PoolConstituentSelectionStep } from './sections/poolConstituentSelectionStep';
import { SimulationRunnerHeader } from './sections/simulationRunnerHeader';
import { SimulationRunnerImportResultsModal } from './sections/simulationRunnerImportResultsModal';

export default function SimulationRunner() {
  const dispatch = useAppDispatch();

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const onChange = (value: number) => {
    if (value === 5 && runStatusIndex !== 2) {
      return;
    }

    dispatch(changeSimulationRunnerCurrentStepIndex(value));
  };

  const paramsFileInputRef = useRef<HTMLInputElement>(null);
  const resultsFileInputRef = useRef<HTMLInputElement>(null);

  const handleParamsImportClick = () => {
    paramsFileInputRef.current?.click();
  };

  const handleResultsImportClick = () => {
    resultsFileInputRef.current?.click();
  };

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
          return <div>Training progress</div>;
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
        onResetClick={() => {
          dispatch(resetSimulationRunner());
          dispatch(resetSims());
          dispatch(changeSimulationRunnerCurrentStepIndex(0));
          dispatch(changeSimulationRunnerCurrentRunTypeIndex(0));
        }}
      />

      <SimulationRunnerImportResultsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        paramsFileInputRef={paramsFileInputRef}
        resultsFileInputRef={resultsFileInputRef}
        onParamsImportClick={handleParamsImportClick}
        onResultsImportClick={handleResultsImportClick}
        onParamsFileChange={(event) => handleDownloadParams(event, dispatch)}
        onResultsFileChange={(event) =>
          handleDownloadResults(event, dispatch, setForceViewResults)
        }
      />

      {getRunnerStep()}
    </div>
  );
}

export { SimulationRunner };
