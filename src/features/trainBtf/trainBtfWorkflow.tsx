import { useEffect, useMemo } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useRunTrainingMutation } from '../simulationRunner/simulationRunnerService';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCoinPriceDataLoaded,
  selectEndDate,
  selectSimulationPools,
  selectStartDate,
  selectTrainingParameters,
  setTrainingParameterValue,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import {
  changeSimulationRunnerCurrentRunTypeIndex,
  changeSimulationRunnerCurrentStepIndex,
  selectTrainingErrorMessage,
  selectTrainingRunStatus,
} from '../simulationRunner/simulationRunnerSlice';
import { PoolConstituentSelectionStep } from '../simulationRunner/sections/poolConstituentSelectionStep';
import { SimulationRunnerHookTimePeriodStep } from '../simulationRunner/simulationRunnerHookTimePeriodStep';
import { SimulationRunnerTimePeriodStep } from '../simulationRunner/simulationRunnerTimePeriodStep';
import { createRunTrainingThunk } from '../simulationRunner/trainingRunButtonLogic';
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

function isBooleanLike(value: string): boolean {
  const normalised = value.toLowerCase();
  return normalised === 'true' || normalised === 'false';
}

const OPTIMISER_OPTIONS = ['sgd', 'adam', 'adamw', 'rmsprop'];

export default function TrainBtfWorkflow() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [runTraining, runTrainingState] = useRunTrainingMutation();

  const simulationPools = useAppSelector(selectSimulationPools);
  const trainingParameters = useAppSelector(selectTrainingParameters);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const trainingRunStatus = useAppSelector(selectTrainingRunStatus);
  const trainingErrorMessage = useAppSelector(selectTrainingErrorMessage);

  useEffect(() => {
    if (trainingRunStatus === 'Running' || trainingRunStatus === 'Complete') {
      navigate('/train-btf/in-progress');
    }
  }, [navigate, trainingRunStatus]);

  const isKickoffLoading = runTrainingState.isLoading;
  const canStartTraining =
    coinDataLoaded && simulationPools.length > 0 && !isKickoffLoading;

  const configuredPoolNames = useMemo(
    () =>
      simulationPools.map(
        (pool) =>
          `${pool.updateRule.updateRuleName} (${pool.poolConstituents.length} tokens)`
      ),
    [simulationPools]
  );

  const onUpdateTrainingParameter = (name: string, value: string) => {
    dispatch(setTrainingParameterValue({ name, value }));
  };

  const onStartTraining = async () => {
    dispatch(changeSimulationRunnerCurrentRunTypeIndex(2));
    dispatch(changeSimulationRunnerCurrentStepIndex(5));
    await dispatch(createRunTrainingThunk({ runTraining }));
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBlock}>
        <Title level={2} className={styles.sectionTitle}>
          Train BTF
        </Title>
        <Text className={styles.subtitle}>
          Configure the same core simulation inputs in one long-form flow, then
          add optimisation settings and trigger a training run.
        </Text>
      </div>

      <Card className={styles.sectionCard}>
        <Title level={4} className={styles.sectionTitle}>
          Workflow Status
        </Title>
        <div className={styles.runSummaryItem}>
          Current training status: {getStatusTag(trainingRunStatus)}
        </div>
        <div className={styles.runSummaryItem}>
          Configured pools: {simulationPools.length}
        </div>
        <div className={styles.runSummaryItem}>
          Coin data loaded: {coinDataLoaded ? 'Yes' : 'No'}
        </div>
        {trainingErrorMessage ? (
          <Alert
            type="error"
            showIcon
            message={trainingErrorMessage}
            style={{ marginTop: 12 }}
          />
        ) : null}
      </Card>

      <Card className={styles.sectionCard}>
        <Title level={4} className={styles.sectionTitle}>
          1. Pool and Strategy Configuration
        </Title>
        <Text className={styles.sectionDescription}>
          Reuse the existing simulator pool builder to choose constituents,
          update rules, and initial pool setup.
        </Text>
        <PoolConstituentSelectionStep />
      </Card>

      <Card className={styles.sectionCard}>
        <Title level={4} className={styles.sectionTitle}>
          2. Training Window and Imports
        </Title>
        <Text className={styles.sectionDescription}>
          Set the historic window and optionally import swaps and gas series.
        </Text>
        <SimulationRunnerTimePeriodStep />
      </Card>

      <Card className={styles.sectionCard}>
        <Title level={4} className={styles.sectionTitle}>
          3. Fee Hook Configuration
        </Title>
        <Text className={styles.sectionDescription}>
          Configure static or dynamic fee hooks for the selected pool.
        </Text>
        <SimulationRunnerHookTimePeriodStep />
      </Card>

      <Card className={styles.sectionCard}>
        <Title level={4} className={styles.sectionTitle}>
          4. Optimisation Settings
        </Title>
        <Text className={styles.sectionDescription}>
          These settings are appended to the run payload and used by the
          backend training runner.
        </Text>

        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {trainingParameters.trainingParameters.map((parameter) => {
            const isOptimiser = parameter.name === 'optimiser';
            const isBoolean = isBooleanLike(parameter.value);

            return (
              <div key={parameter.name} className={styles.optimisationRow}>
                <Row gutter={12} align="middle">
                  <Col xs={24} lg={6}>
                    <Text strong>{parameter.name}</Text>
                  </Col>
                  <Col xs={24} lg={10}>
                    {isOptimiser ? (
                      <Select
                        value={parameter.value}
                        options={OPTIMISER_OPTIONS.map((option) => ({
                          label: option,
                          value: option,
                        }))}
                        onChange={(value) =>
                          onUpdateTrainingParameter(parameter.name, value)
                        }
                        style={{ width: '100%' }}
                      />
                    ) : isBoolean ? (
                      <Select
                        value={parameter.value.toLowerCase()}
                        options={[
                          { label: 'true', value: 'true' },
                          { label: 'false', value: 'false' },
                        ]}
                        onChange={(value) =>
                          onUpdateTrainingParameter(parameter.name, value)
                        }
                        style={{ width: '100%' }}
                      />
                    ) : (
                      <Input
                        value={parameter.value}
                        onChange={(event) =>
                          onUpdateTrainingParameter(
                            parameter.name,
                            event.target.value
                          )
                        }
                      />
                    )}
                  </Col>
                  <Col xs={24} lg={8}>
                    <Text type="secondary">
                      {parameter.description}
                      {(parameter.minValue || parameter.maxValue) &&
                        ` (min: ${parameter.minValue || '-'}, max: ${
                          parameter.maxValue || '-'
                        })`}
                    </Text>
                  </Col>
                </Row>
              </div>
            );
          })}
        </Space>
      </Card>

      <Card className={styles.sectionCard}>
        <Title level={4} className={styles.sectionTitle}>
          5. Kick Off Training
        </Title>
        <Text className={styles.sectionDescription}>
          Start the training run and continue to the in-progress polling view.
        </Text>

        <Divider />

        <div className={styles.runSummaryItem}>
          Window: {startDate} to {endDate}
        </div>
        <div className={styles.runSummaryItem}>
          Pools queued: {simulationPools.length}
        </div>
        <div className={styles.runSummaryItem}>
          Pool summary:{' '}
          {configuredPoolNames.length > 0
            ? configuredPoolNames.join(', ')
            : 'No pools configured'}
        </div>

        <Button
          type="primary"
          size="large"
          disabled={!canStartTraining}
          loading={isKickoffLoading}
          onClick={onStartTraining}
          style={{ marginTop: 12 }}
        >
          Start Train BTF
        </Button>
      </Card>
    </div>
  );
}

