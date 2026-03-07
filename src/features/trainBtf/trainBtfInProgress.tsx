import { useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useRetrieveTrainingMutation } from '../simulationRunner/simulationRunnerService';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectActiveTrainingRunId,
  selectActiveTrainingRunLocation,
  selectTrainingErrorMessage,
  selectTrainingLastUpdatedAtIso,
  selectTrainingLatestObjective,
  selectTrainingLatestStep,
  selectTrainingRunStatus,
  selectTrainingTotalSteps,
} from '../simulationRunner/simulationRunnerSlice';
import { createPollTrainingProgressThunk } from '../simulationRunner/trainingRunButtonLogic';
import styles from './trainBtf.module.css';

const { Title, Text } = Typography;

function getStatusTag(status: 'Pending' | 'Running' | 'Complete' | 'Failed') {
  switch (status) {
    case 'Running':
      return <Tag color="processing">Running</Tag>;
    case 'Complete':
      return <Tag color="success">Complete</Tag>;
    case 'Failed':
      return <Tag color="error">Failed</Tag>;
    default:
      return <Tag>Pending</Tag>;
  }
}

export default function TrainBtfInProgress() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [retrieveTraining, retrieveState] = useRetrieveTrainingMutation();

  const runId = useAppSelector(selectActiveTrainingRunId);
  const runLocation = useAppSelector(selectActiveTrainingRunLocation);
  const trainingRunStatus = useAppSelector(selectTrainingRunStatus);
  const trainingLatestStep = useAppSelector(selectTrainingLatestStep);
  const trainingTotalSteps = useAppSelector(selectTrainingTotalSteps);
  const trainingLatestObjective = useAppSelector(selectTrainingLatestObjective);
  const trainingLastUpdatedAtIso = useAppSelector(selectTrainingLastUpdatedAtIso);
  const trainingErrorMessage = useAppSelector(selectTrainingErrorMessage);

  useEffect(() => {
    if (!runId || trainingRunStatus !== 'Running') {
      return;
    }

    void dispatch(createPollTrainingProgressThunk({ retrieveTraining }));

    const interval = window.setInterval(() => {
      void dispatch(createPollTrainingProgressThunk({ retrieveTraining }));
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [dispatch, retrieveTraining, runId, trainingRunStatus]);

  const progressPercent =
    trainingTotalSteps > 0
      ? Math.min(100, (trainingLatestStep / trainingTotalSteps) * 100)
      : 0;

  const refreshNow = async () => {
    await dispatch(createPollTrainingProgressThunk({ retrieveTraining }));
  };

  if (!runId) {
    return (
      <div className={styles.pageContainer}>
        <Alert
          showIcon
          type="warning"
          message="No active Train BTF run"
          description="Start a training run from the Train BTF builder screen."
        />
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={() => navigate('/train-btf')}
        >
          Open Train BTF Builder
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Title level={2}>Train BTF In Progress</Title>
      <Text className={styles.subtitle}>
        Polling training run status and step metrics. This screen is a stub and
        will be expanded as the backend progress file structure is finalized.
      </Text>

      <Card className={styles.sectionCard}>
        <div className={styles.runSummaryItem}>
          Status: {getStatusTag(trainingRunStatus)}
        </div>
        <div className={styles.runSummaryItem}>Run ID: {runId}</div>
        <div className={styles.runSummaryItem}>
          Run location: {runLocation || 'Not provided'}
        </div>
        <div className={styles.runSummaryItem}>
          Last update:{' '}
          {trainingLastUpdatedAtIso
            ? new Date(trainingLastUpdatedAtIso).toLocaleString()
            : 'N/A'}
        </div>
        {trainingErrorMessage ? (
          <Alert
            showIcon
            type="error"
            message={trainingErrorMessage}
            style={{ marginTop: 12 }}
          />
        ) : null}
      </Card>

      <Row gutter={12} className={styles.progressCardsRow}>
        <Col xs={24} md={8}>
          <Card className={styles.progressCard}>
            <Statistic title="Current Step" value={trainingLatestStep} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className={styles.progressCard}>
            <Statistic title="Total Steps" value={trainingTotalSteps} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className={styles.progressCard}>
            <Statistic
              title="Latest Objective"
              value={trainingLatestObjective ?? '-'}
              precision={4}
            />
          </Card>
        </Col>
      </Row>

      <Card className={styles.sectionCard}>
        <Progress
          percent={Number.isFinite(progressPercent) ? progressPercent : 0}
          status={trainingRunStatus === 'Failed' ? 'exception' : 'active'}
        />

        <Space style={{ marginTop: 16 }} wrap>
          <Button loading={retrieveState.isLoading} onClick={refreshNow}>
            Refresh Now
          </Button>
          <Button onClick={() => navigate('/train-btf')}>Back to Builder</Button>
          <Button
            type="primary"
            onClick={() => navigate('/train-btf/results')}
            disabled={
              trainingRunStatus !== 'Complete' && trainingRunStatus !== 'Failed'
            }
          >
            Open Result Chooser
          </Button>
        </Space>
      </Card>
    </div>
  );
}

