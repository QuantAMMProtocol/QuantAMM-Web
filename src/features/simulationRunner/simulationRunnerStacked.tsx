import styles from '../simulationResults/simulationResultSummary.module.css';
import {
  selectSimulationRunBreakdowns,
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerCurrentRunTypeIndex,
  selectSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
  resetSimulationRunner,
} from './simulationRunnerSlice';

import { Button, Col, Divider, Row, Steps, Modal, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  RedoOutlined,
  RiseOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetSims } from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationRunnerTimePeriodStep } from './simulationRunnerTimePeriodStep';
import { SimulationRunnerHookTimePeriodStep } from './simulationRunnerHookTimePeriodStep';
import { handleDownloadResults, handleDownloadParams } from './SimulationHelper';
import { SimulationRunnerFinalReviewStep } from './simulationRunnerFinalReviewStep';
import { PoolRuleConfiguration } from '../simulationRunConfiguration/poolRuleConfiguration';
import { SimulationResultsSummaryStep } from '../simulationResults/simulationResultsSummaryStep';
import { SimulationResultSaveToCompareTab } from '../simulationResults/simulationResultSaveToCompareTab';
import { SimulationRunnerHistoricInProgress } from './simulationRunnerHistoricInProgress';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SimulatorOptions } from './simulationOptions';

/**
 * SimulationRunnerStacked
 *
 * Progressive, scrollable runner where selecting a step reveals that section *below* previous ones.
 * Future sections remain hidden; previous sections remain visible for context. We also auto-scroll to
 * the newly revealed section. Clicking an earlier step scrolls back up without hiding content.
 */
export function SimulationRunnerStacked() {
  const dispatch = useAppDispatch();

  const results = useAppSelector(selectSimulationRunBreakdowns);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const runTypeIndex = useAppSelector(selectSimulationRunnerCurrentRunTypeIndex);
  const currentStepIndex = useAppSelector(selectSimulationRunnerCurrentStepIndex);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceViewResults, setForceViewResults] = useState(false);

  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = sectionRefs.current[currentStepIndex];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [currentStepIndex]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // Keep gating rules identical to original runner
  const isStepAllowedToOpen = (target: number): boolean => {
    if (target > currentStepIndex + 1) return false;
    if (target === 5 && runStatusIndex < 1) return false; // Run Status only after start
    if ((target === 6 || target === 7) && runStatusIndex < 2) return false; // Results/Save after finish
    return true;
  };

  const onChange = (value: number) => {
    if (!isStepAllowedToOpen(value)) return;
    dispatch(changeSimulationRunnerCurrentStepIndex(value));
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => fileInputRef.current?.click();

  const StepTitle: React.FC<{ index: number; title: string; tooltip: string; icon: React.ReactNode }> = ({ index, title, tooltip, icon }) => (
    <div className="flex items-center gap-2">
      <span className="font-medium">{index + 1}. {title}</span>
      <Tooltip title={tooltip}>{icon}</Tooltip>
    </div>
  );

  const stepItems = useMemo(() => ([
    {
      key: 0,
      title: 'Pool',
      tooltip: 'Select AMM types to simulate and review configured pools.',
      icon: <PieChartOutlined style={{ paddingLeft: 5 }} />,
      render: () => (
        <Row>
          <Col span={24}>
            <PoolRuleConfiguration />
          </Col>
        </Row>
      ),
    },
    {
      key: 1,
      title: 'Time Range',
      tooltip: 'Select the time range and optionally include retail swap time series.',
      icon: <RiseOutlined style={{ paddingLeft: 5 }} />,
      render: () => <SimulationRunnerTimePeriodStep />,
    },
    {
      key: 2,
      title: 'Hooks',
      tooltip: 'Configure hooks such as time-varying swap fees.',
      icon: <ClockCircleOutlined style={{ paddingLeft: 5 }} />,
      render: () => <SimulationRunnerHookTimePeriodStep />,
    },
    {
      key: 3,
      title: 'Final Review',
      tooltip: 'Review all settings before running the simulation.',
      icon: <CheckCircleOutlined style={{ paddingLeft: 5 }} />,
      render: () => <SimulationRunnerFinalReviewStep />,
    },
    {
      key: 4,
      title: 'Run Status',
      tooltip: 'Live status while simulations are running.',
      icon: <RedoOutlined style={{ paddingLeft: 5 }} />,
      render: () => (runTypeIndex === 1 ? <SimulationRunnerHistoricInProgress /> : runTypeIndex === 2 ? <div>Training progress</div> : <SimulationRunnerFinalReviewStep />),
    },
    {
      key: 5,
      title: 'Results',
      tooltip: 'View and compare pool performance and day-by-day changes.',
      icon: <DotChartOutlined style={{ paddingLeft: 5 }} />,
      render: () => (
        <SimulationResultsSummaryStep breakdowns={results} forceViewResults={forceViewResults} />
      ),
    },
    {
      key: 6,
      title: 'Save Results',
      tooltip: 'Download or save results for multi-run comparison.',
      icon: <SaveOutlined style={{ paddingLeft: 5 }} />,
      render: () => (
        <SimulationResultSaveToCompareTab breakdowns={results} forceViewResults={false} />
      ),
    },
  ]), [results, forceViewResults, runTypeIndex]);

  const visibleSections = stepItems.filter(s => s.key <= currentStepIndex);

  const stepStatuses = (index: number): 'wait' | 'process' | 'finish' => {
    // Match the original runner's feel: earlier finished, current processing
    if (index < currentStepIndex) return 'finish';
    if (index === currentStepIndex) return 'process';
    return 'wait';
  };

  return (
    // Wrap in the same Row/Col frame as the original to preserve spacing/theme
    <>
    <Row>
      <Col span={1}></Col>
      <Col span={22}>
        {/* Top controls (no initial landing page) */}
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'var(--primary-color)' }}>
          <Row style={{ padding: 10 }}>
            <Col span={2}>
              <Button type="primary" className={styles.importResetButton} onClick={showModal}>Import</Button>
            </Col>
            <Col span={20}>
              <Steps
            current={currentStepIndex}
            onChange={onChange}
            size="small"
            items={stepItems.map((s, i) => ({
              title: <Tooltip title={s.tooltip}>{s.title}</Tooltip>,
              icon: s.icon as any,
              status: stepStatuses(i),
              disabled: !isStepAllowedToOpen(i),
            }))}
              />
            </Col>
            <Col span={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
            type="primary"
            className={styles.importResetButton}
            disabled={runStatusIndex < 2}
            onClick={() => {
              dispatch(resetSimulationRunner());
              dispatch(resetSims());
              dispatch(changeSimulationRunnerCurrentStepIndex(0));
              dispatch(changeSimulationRunnerCurrentRunTypeIndex(0));
            }}
              >
            Reset
              </Button>
            </Col>
          </Row>
        </div>

        <Modal title="Import File or Select Balancer Pool" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Col span={24} className={styles.modalContent}>
            <h4>Import from File:</h4>
            <Button onClick={handleButtonClick}>
              <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={(event) => handleDownloadParams(event, dispatch)} />
              Set Parameters to downloaded Run Params
            </Button>

            <div className={styles.orDivider}>OR</div>

            <Button onClick={handleButtonClick}>
              <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={(event) => handleDownloadResults(event, dispatch, setForceViewResults)} />
              Import Results from Run
            </Button>
          </Col>
        </Modal>

        {/* Progressive sections – future hidden, past visible */}
        <div style={{ paddingBottom: 10 }}>
          {visibleSections.map((s, i) => (
            <div key={s.key} ref={(el) => (sectionRefs.current[s.key] = el)} style={{ scrollMarginTop: 80 }}>
              <div style={{ marginBottom: 32 }}>{s.render()}</div>
              {s.key === currentStepIndex && s.key < stepItems.length - 1 && (
                <Row justify="end">
                    <Col span={8}></Col>
                  <Col span={8}>
                    <Button
                      type="primary"
                      style={{ backgroundColor: 'green', width: s.key < 6 ? '100%' : '40%', margin:'5px' }}
                      onClick={() => {
                        const next = s.key + 1;
                        if (isStepAllowedToOpen(next)) {
                          dispatch(changeSimulationRunnerCurrentStepIndex(next));
                        }
                      }}
                      disabled={!isStepAllowedToOpen(s.key + 1)}
                    >
                      Continue to {stepItems[s.key + 1]?.title}
                    </Button>
                    {s.key >= 6 && (
                        <Button
                            type="primary"
                            style={{ backgroundColor: 'green', width: s.key < 6 ? '100%' : '40%', margin:'5px' }}
                      
                            onClick={() => {
                                dispatch(resetSimulationRunner());
                                dispatch(resetSims());
                                dispatch(changeSimulationRunnerCurrentStepIndex(0));
                                dispatch(changeSimulationRunnerCurrentRunTypeIndex(0));
                            }}
                        >
                            Start New Simulation
                        </Button>
                    )}
                  </Col>
                    <Col span={8}></Col>
                </Row>
              )}
            </div>
          ))}
        </div>
      </Col>
      <Col span={1}></Col>
    </Row>
    </>
  );
}

