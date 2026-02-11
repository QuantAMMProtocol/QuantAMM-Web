import { Button, Col, Modal } from 'antd';
import { ChangeEvent, RefObject } from 'react';
import styles from '../../simulationResults/simulationResultSummary.module.css';
import runnerStyles from '../simulationRunnerCommon.module.css';

interface ImportResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paramsFileInputRef: RefObject<HTMLInputElement>;
  resultsFileInputRef: RefObject<HTMLInputElement>;
  onParamsImportClick: () => void;
  onResultsImportClick: () => void;
  onParamsFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onResultsFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function SimulationRunnerImportResultsModal({
  isOpen,
  onClose,
  paramsFileInputRef,
  resultsFileInputRef,
  onParamsImportClick,
  onResultsImportClick,
  onParamsFileChange,
  onResultsFileChange,
}: ImportResultsModalProps) {
  return (
    <Modal
      title="Import File or Select Balancer Pool"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
    >
      <Col span={24} className={styles.modalContent}>
        <h4>Import from File:</h4>
        <input
          type="file"
          className={runnerStyles.hiddenFileInput}
          ref={paramsFileInputRef}
          onChange={onParamsFileChange}
        />
        <Button onClick={onParamsImportClick}>
          Set Parameters to downloaded Run Params
        </Button>

        <div className={styles.orDivider}>OR</div>

        <input
          type="file"
          className={runnerStyles.hiddenFileInput}
          ref={resultsFileInputRef}
          onChange={onResultsFileChange}
        />
        <Button onClick={onResultsImportClick}>Import Results from Run</Button>
      </Col>
    </Modal>
  );
}
