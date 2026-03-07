import { useMemo, useState } from 'react';
import { Alert, Button, Card, Radio, Space, Table, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import {
  selectActiveTrainingRunId,
  selectTrainingRunHistory,
} from '../simulationRunner/simulationRunnerSlice';
import { TrainingRunSummary } from '../simulationRunner/simulationRunnerModels';
import styles from './trainBtf.module.css';

const { Title, Text } = Typography;

function getStatusTag(status: TrainingRunSummary['status']) {
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

export default function TrainBtfResults() {
  const navigate = useNavigate();
  const trainingRunHistory = useAppSelector(selectTrainingRunHistory);
  const activeRunId = useAppSelector(selectActiveTrainingRunId);
  const [selectedRunId, setSelectedRunId] = useState<string>(activeRunId);

  const selectedRun = useMemo(
    () => trainingRunHistory.find((run) => run.runId === selectedRunId),
    [selectedRunId, trainingRunHistory]
  );

  return (
    <div className={styles.pageContainer}>
      <Title level={2}>Train BTF Result Chooser</Title>
      <Text className={styles.subtitle}>
        This is a stub result-selection screen. A full post-run analysis view
        will be added after the progress/result file structure is finalized.
      </Text>

      {trainingRunHistory.length === 0 ? (
        <Alert
          type="info"
          showIcon
          message="No training runs in shared state yet"
          description="Start a Train BTF run from the builder to populate the result chooser."
          style={{ marginTop: 16 }}
        />
      ) : (
        <Card className={styles.sectionCard}>
          <Table
            rowKey={(row) => row.runId}
            dataSource={trainingRunHistory}
            pagination={{ pageSize: 5 }}
            className={styles.tableWrap}
            columns={[
              {
                title: 'Run ID',
                dataIndex: 'runId',
                key: 'runId',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (value: TrainingRunSummary['status']) =>
                  getStatusTag(value),
              },
              {
                title: 'Step',
                key: 'step',
                render: (_, row: TrainingRunSummary) =>
                  row.totalSteps
                    ? `${row.latestStep ?? 0}/${row.totalSteps}`
                    : row.latestStep ?? 0,
              },
              {
                title: 'Started',
                dataIndex: 'startedAtIso',
                key: 'startedAtIso',
                render: (value: string) => new Date(value).toLocaleString(),
              },
              {
                title: 'Finished',
                dataIndex: 'finishedAtIso',
                key: 'finishedAtIso',
                render: (value: string | undefined) =>
                  value ? new Date(value).toLocaleString() : '-',
              },
            ]}
          />

          <Radio.Group
            value={selectedRunId}
            style={{ marginTop: 12 }}
            onChange={(event) => setSelectedRunId(event.target.value)}
          >
            <Space direction="vertical">
              {trainingRunHistory.map((run) => (
                <Radio key={run.runId} value={run.runId}>
                  {run.runId}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Card>
      )}

      <Card className={styles.sectionCard}>
        <Title level={5}>Selected Result Stub</Title>
        {selectedRun ? (
          <>
            <div className={styles.runSummaryItem}>Run ID: {selectedRun.runId}</div>
            <div className={styles.runSummaryItem}>
              Status: {getStatusTag(selectedRun.status)}
            </div>
            <div className={styles.runSummaryItem}>
              Run file: {selectedRun.runLocation || 'Not provided'}
            </div>
            <div className={styles.runSummaryItem}>
              Latest objective: {selectedRun.latestObjective ?? '-'}
            </div>
          </>
        ) : (
          <Text type="secondary">
            Select a run above. Detailed result analysis will be added in a
            later iteration.
          </Text>
        )}
      </Card>

      <Space className={styles.resultsActions}>
        <Button onClick={() => navigate('/train-btf/in-progress')}>
          Back to In Progress
        </Button>
        <Button type="primary" onClick={() => navigate('/train-btf')}>
          Open Builder
        </Button>
      </Space>
    </div>
  );
}

