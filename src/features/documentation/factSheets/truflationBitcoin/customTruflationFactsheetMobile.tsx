import { Button, Card, Col, Collapse, Radio, Row, Space, Tooltip } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared/graphs/weightChangeOverTime';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';
import { SimulationResultDrawdownChart } from '../../../simulationResults/visualisations/simulationResultDrawdownGraph';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../../app/hooks';
import { selectTheme } from '../../../themes/themeSlice';
import {
  benchmarkMetricThresholds,
  returnMetricThresholds,
} from '../../../../models/constants';
import { FactsheetModel } from '../../landing/desktop/factsheetModel';
import { FAQItems } from '../../landing/faqItems';
import { useNavigate } from 'react-router-dom';
import { TruflationInflationRegime } from '../../../shared/eli5/truflationInflationRegime';

interface FactsheetDesktopProps {
  model: FactsheetModel;
}

type ExplorerView = 'drawdowns' | 'composition';

type TrainingView = 'drawdowns' | 'marketValue' | 'weightChange';

export function TruflationFactSheetMobile(props: FactsheetDesktopProps) {
  const [breakdowns, setBreakdowns] = useState<
    Record<string, SimulationRunBreakdown>
  >({});

  const [loading, setLoading] = useState<boolean>(true);
  const [faqEli5, setFAQEli5] = useState('ELI5');
  const isDarkTheme = useAppSelector(selectTheme);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<Record<string, SimulationRunBreakdown>> => {
      setLoading(true);
      const fetchedBreakdowns = await Promise.all(
        poolNames.map(async (poolName) => {
          const breakdown = await getBreakdown(poolName);
          return { [poolName]: breakdown };
        })
      );
      const breakdownsMap = fetchedBreakdowns.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setBreakdowns(breakdownsMap);
      return breakdownsMap;
    };

    if (loading) {
      loadBreakdowns(props.model.pools)
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, breakdowns, props.model.pools]);

  const [testPeriod, setTestPeriod] = useState<string>(
    props.model.defaultPeriod[0]
  );

  const [metricsPeriod, setMetricsPeriod] = useState<string>(
    props.model.trainPeriod
  );

  const [view, setView] = useState<ExplorerView>('drawdowns');
  const [trainingView, setTrainingView] = useState<TrainingView>('drawdowns');

  const viewOptions = useMemo(
    () => [
      { label: 'Drawdowns', value: 'drawdowns' as const },
      { label: 'Composition', value: 'composition' as const },
    ],
    []
  );

  const trainingViewOptions = useMemo(
    () => [
      { label: 'Drawdowns', value: 'drawdowns' as const },
      { label: 'Market value', value: 'marketValue' as const },
      { label: 'Weight change', value: 'weightChange' as const },
    ],
    []
  );

  const poolKeyFor = useCallback(
    (strategyPrefix: 'BTF' | 'Hodl', period: string) => {
      return props.model.poolPrefix + `${strategyPrefix}${period}`;
    },
    [props.model.poolPrefix]
  );

  const btfTest = useMemo(
    () => poolKeyFor('BTF', testPeriod),
    [poolKeyFor, testPeriod]
  );

  const hodlTest = useMemo(
    () => poolKeyFor('Hodl', testPeriod),
    [poolKeyFor, testPeriod]
  );

  const btfTrain = useMemo(
    () => poolKeyFor('BTF', props.model.trainPeriod),
    [poolKeyFor, props.model.trainPeriod]
  );

  const hodlTrain = useMemo(
    () => poolKeyFor('Hodl', props.model.trainPeriod),
    [poolKeyFor, props.model.trainPeriod]
  );

  const btfMetrics = useMemo(
    () => poolKeyFor('BTF', metricsPeriod),
    [poolKeyFor, metricsPeriod]
  );

  const hodlMetrics = useMemo(
    () => poolKeyFor('Hodl', metricsPeriod),
    [poolKeyFor, metricsPeriod]
  );

  const renderPeriodSelector = (
    includeTrainPeriod: boolean,
    value: string,
    onChange: (v: string) => void
  ) => (
    <Radio.Group
      onChange={(e) => onChange(e.target.value)}
      value={value}
      buttonStyle="solid"
      size="small"
    >
      {includeTrainPeriod &&
        props.model.trainPeriod &&
        props.model.trainPeriod !== props.model.defaultPeriod[0] &&
        props.model.trainPeriod !== props.model.alternatePeriod[0] && (
          <Radio.Button value={props.model.trainPeriod} style={{width:'100%'}}>
            {props.model.trainingWindowTitle}
          </Radio.Button>
        )}
      <Radio.Button value={props.model.defaultPeriod[0]} style={{width:'100%'}}>
        {props.model.defaultPeriod[1]}
      </Radio.Button>
      {props.model.alternatePeriod[0] != '' ? (
        <Radio.Button value={props.model.alternatePeriod[0]} style={{width:'100%'}}>
          {props.model.alternatePeriod[1]}
        </Radio.Button>
      ) : (
        <></>
      )}
    </Radio.Group>
  );

  const visibleMetrics: [string, string][] = [
    ['return', 'Absolute Return (%)'],
    ['benchmark', "Annualized Jensen's Alpha (%)"],
    ['return', 'Annualized Sharpe Ratio'],
    ['return', 'Annualized Sortino Ratio'],
    ['return', 'Annualized Information Ratio'],
    ['benchmark', 'Total Capture Ratio'],
  ];

  const getColorFor = useCallback((metric: string, value: number | null) => {
    if (value == null) return undefined;
    const t = [...returnMetricThresholds, ...benchmarkMetricThresholds].find(
      (x) => x.key === metric
    );
    if (!t) return undefined;

    const { veryLow, low, medium, high } = t;
    const ascending = high > medium;
    if (ascending) {
      if (value >= high) return t.highColor;
      if (value >= medium) return t.mediumColor;
      if (value >= low) return t.lowColor;
      if (value >= veryLow) return t.veryLowColor;
      return '#610000';
    } else {
      if (value <= high) return t.highColor;
      if (value <= medium) return t.mediumColor;
      if (value <= low) return t.lowColor;
      if (value <= veryLow) return t.veryLowColor;
      return '#01ec38';
    }
  }, []);

  return (
    <div>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <img
              src={props.model.factsheetImage.image}
              alt={props.model.factsheetImage.alt}
              style={{
                width: props.model.factsheetImage.width,
                height: 'auto',
              }}
            />
            <h1 style={{ textAlign: 'center', margin: 0 }}>
              {props.model.mainTitle}
            </h1>
            <p style={{ textAlign: 'center' }}>{props.model.mainDescription}</p>
          </div>
        </Col>
        <Col span={1}></Col>

        <Col span={1}></Col>
        <Col span={22}>
          <h4>BTF Objective</h4>
          <p>{props.model.objective}</p>
          <h4>Responsive Strategy Objective</h4>
          <p>
            The BTF structure allows this to be done in a feeless manner for the
            LP with continuous on-chain rebalancing rather than the traditional
            monthly or quarterly rebalances. Re-weighting is performed daily.
          </p>
          <p>
            BTFs also augment returns with swap fees associated with providing a
            decentralised liquidity pool and provide an ERC20 token that can be
            used in other DeFi applications.
          </p>
          <p>
            It is crucial to recognize that BTFs carry risks. Reallocation
            strategies are not market-neutral and involve directional
            assumptions about asset allocation. Furthermore, the value of assets
            can be affected by macro economic factors and global events.
          </p>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>TEST WINDOW PERFORMANCE</h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row style={{ height: '155vh' }}>
        <Col span={1}></Col>
        <Col span={22}>
          <Row style={{ height: '65vh' }}>
            <Col span={24}>
              <Card title="STRATEGY DETAILS" style={{ height: '65vh' }}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: '100%', marginBottom: 12 }}
                >
                  <Button
                    size="small"
                    style={{ width: '100%' }}
                    onClick={() =>
                      navigate('/factsheet/example/' + props.model.poolId)
                    }
                  >
                    View Simulation Results
                  </Button>
                  <Button
                    disabled={props.model.status !== 'LIVE'}
                    size="small"
                    type="primary"
                    style={{ width: '100%' }}
                    onClick={() =>
                      navigate(
                        '/product-explorer/' +
                          props.model.poolChain +
                          '/' +
                          props.model.poolId
                      )
                    }
                  >
                    View Live Pool
                  </Button>
                </Space>

                <div style={{ overflowY: 'auto', height: '48vh' }}>
                  <TruflationInflationRegime />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>

        <Col span={1}></Col>
        <Col span={22}>
          <Card
            title="Test Window Strategy Explorer"
            style={{ height: '80vh', marginTop: '15px' }}
          >
            <Space
              direction="vertical"
              size="small"
              style={{ width: '100%', marginBottom: 12 }}
            >
              {viewOptions.map((opt) => (
                <Button
                  key={opt.value}
                  size="small"
                  type={view === opt.value ? 'primary' : 'default'}
                  style={{ width: '100%' }}
                  onClick={() => setView(opt.value as ExplorerView)}
                >
                  {opt.label}
                </Button>
              ))}
            </Space>

            {view === 'drawdowns' ? (
              <Row>
                <Col span={24}>
                  <SimulationResultDrawdownChart
                    breakdowns={
                      loading ? [] : [breakdowns[btfTest], breakdowns[hodlTest]]
                    }
                    forceViewResults={true}
                    hideTitle={true}
                  />
                </Col>
              </Row>
            ) : (
              <Row>
                <Col span={24} style={{ paddingTop: '10px' }}>
                  <WeightChangeOverTimeGraph
                    simulationRunBreakdown={breakdowns[btfTest]}
                    overrideChartTheme={
                      isDarkTheme ? 'ag-default-dark' : 'ag-default'
                    }
                    overrideXAxisInterval={Math.max(
                      1,
                      Math.ceil(((breakdowns[btfTest]?.timeSteps.length ?? 0) / 30) / 2.5)
                    )}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row style={{ marginTop: '100px' }}>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>SIMULATED PERFORMANCE</h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span>SIMULATED BTF TOTAL $ VALUE OVER TIME</span>
              </div>
            }
            style={{ margin: '5px' }}
          >
            {renderPeriodSelector(false, testPeriod, setTestPeriod)}
            <div hidden={loading}>
              <SimulationResultMarketValueChart
                hideTitle={true}
                overrideNagivagtion={false}
                breakdowns={
                  loading ? [] : [breakdowns[btfTest], breakdowns[hodlTest]]
                }
                overrideSeriesStrokeColor={
                  props.model.cumulativePerformanceOverrideSeriesStrokeColor
                }
                overrideSeriesName={
                  props.model.cumulativePerformanceOverrideSeriesName
                }
                overrideXAxisInterval={Math.max(
                      1,
                      Math.ceil(((breakdowns[btfTest]?.timeSteps.length ?? 0) / 30) / 1)
                    )}
                forceViewResults={true}
              />
            </div>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>
            QUANTITATIVE FINANCIAL ANALYSIS
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={24}>
          <Row>
            <Col span={1}></Col>
            <Col span={22}>
              <Card
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span>SIMULATED FINANCIAL METRICS</span>
                  </div>
                }
                style={{ margin: '5px' }}
              >
                {renderPeriodSelector(true, metricsPeriod, setMetricsPeriod)}
                {visibleMetrics.map(([category, metric]) => (
                  <div key={metric} style={{ marginBottom: '20px' }}>
                    <h4>{metric}</h4>
                    <Row>
                      <Col span={24}>
                        <span>BTF:</span>{' '}
                        <span
                          style={{
                            color: getColorFor(
                              metric,
                              breakdowns[btfMetrics]?.simulationRunResultAnalysis?.[
                                `${category}_analysis` as
                                  | 'return_analysis'
                                  | 'benchmark_analysis'
                              ]?.find((x) => x.metricName == metric)
                                ?.metricValue ?? 0
                            ),
                          }}
                        >
                          {loading
                            ? 'Loading...'
                            : breakdowns[btfMetrics]?.simulationRunResultAnalysis?.[
                                `${category}_analysis` as
                                  | 'return_analysis'
                                  | 'benchmark_analysis'
                              ]?.find((x) => x.metricName == metric)
                                ?.metricValue ?? 'N/A'}
                        </span>
                      </Col>

                      <Col span={24}>
                        <span>HODL:</span>{' '}
                        <span
                          style={{
                            color: getColorFor(
                              metric,
                              breakdowns[hodlMetrics]?.simulationRunResultAnalysis?.[
                                `${category}_analysis` as
                                  | 'return_analysis'
                                  | 'benchmark_analysis'
                              ]?.find((x) => x.metricName == metric)
                                ?.metricValue ?? 0
                            ),
                          }}
                        >
                          {loading
                            ? 'Loading...'
                            : breakdowns[hodlMetrics]?.simulationRunResultAnalysis?.[
                                `${category}_analysis` as
                                  | 'return_analysis'
                                  | 'benchmark_analysis'
                              ]?.find((x) => x.metricName == metric)
                                ?.metricValue ?? 'N/A'}
                        </span>
                      </Col>
                    </Row>
                  </div>
                ))}

                <Row>
                  <Col span={24}>
                    <span>
                      R(f) ={' '}
                      <a
                        href="https://fred.stlouisfed.org/series/DTB3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        3-Month Treasury Bill Secondary Market Rate, Discount
                        Basis (DTB3)
                      </a>
                    </span>
                  </Col>
                  <Col span={24}>
                    <span>R(b) = HODL</span>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={1}></Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>KEY FACTS</h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row style={{ height: '500vh' }}>
        <Col span={1}></Col>
        <Col span={22}>
          <Row style={{ height: '250vh' }}>
            <Col span={24}>
              <Card
                title="Advantages"
                style={{ height: '250vh', overflowY: 'auto' }}
              >
                <Row>
                  {props.model.advantages.map((advantage, index) => (
                    <Col span={24} key={index}>
                      <Card
                        style={{ margin: '5px', height: '57vh' }}
                        title={advantage.title}
                      >
                        <Row>
                          <Col span={24}>{advantage.description}</Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>

        <Row>
          <Col span={1}></Col>
          <Col span={22} style={{ height: '250vh' }}>
            <Card
              style={{ height: '250vh', overflowY: 'auto' }}
              title={'Risks'}
            >
              <Row>
                {props.model.risks.map((risk, index) => (
                  <Col span={24} key={index}>
                    <Card
                      style={{ margin: '5px', height: '57vh' }}
                      title={risk.title}
                    >
                      <Row>
                        <Col span={24}>{risk.description}</Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col span={1}></Col>
        </Row>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>
            RE-WEIGHTING STRATEGY PARAMETER SELECTION
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>{props.model.trainingDescription}</Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <Col span={24}>
            <Card
              title={props.model.trainingWindowTitle}
              style={{ height: '130vh' }}
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: '100%', marginBottom: 12 }}
              >
                {trainingViewOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    size="small"
                    type={trainingView === opt.value ? 'primary' : 'default'}
                    style={{ width: '100%' }}
                    onClick={() => setTrainingView(opt.value as TrainingView)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Space>

              <Row>
                <Col span={24}>
                  <div hidden={loading}>
                    {trainingView === 'drawdowns' && (
                      <>
                        <h5>Drawdowns</h5>
                        <SimulationResultDrawdownChart
                          breakdowns={
                            loading
                              ? []
                              : [breakdowns[btfTrain], breakdowns[hodlTrain]]
                          }
                          forceViewResults={true}
                          hideTitle={true}
                        />
                      </>
                    )}

                    {trainingView === 'marketValue' && (
                      <>
                        <h5>Cumulative performance over time</h5>
                        <SimulationResultMarketValueChart
                          hideTitle={true}
                          overrideNagivagtion={false}
                          breakdowns={
                            loading
                              ? []
                              : [breakdowns[btfTrain], breakdowns[hodlTrain]]
                          }
                          overrideSeriesStrokeColor={
                            props.model
                              .cumulativePerformanceOverrideSeriesStrokeColor
                          }
                          overrideSeriesName={
                            props.model.cumulativePerformanceOverrideSeriesName
                          }
                          overrideXAxisInterval={Math.max(
                      1,
                      Math.ceil(((breakdowns[btfTest]?.timeSteps.length ?? 0) / 30) / 1)
                    )}
                          forceViewResults={true}
                        />
                      </>
                    )}

                    {trainingView === 'weightChange' && (
                      <>
                        <h5>Constituent weights over time</h5>
                        <WeightChangeOverTimeGraph
                          simulationRunBreakdown={breakdowns[btfTrain]}
                          overrideChartTheme={
                            isDarkTheme ? 'ag-default-dark' : 'ag-default'
                          }
                          overrideXAxisInterval={Math.max(
                      1,
                      Math.ceil(((breakdowns[btfTest]?.timeSteps.length ?? 0) / 30) / 1)
                    )}
                        />
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Col>
        <Col span={1}></Col>

        <Col span={1}></Col>
        <Col span={22}>
          <Card
            title={'Parameters Selected'}
            style={{ height: 'auto', marginTop: '20px' }}
          >
            <Row>
              {props.model.trainedParameters.map((parameter, index) => (
                <Col span={24} key={index}>
                  <Card
                    style={{ margin: '5px' }}
                    title={
                      <Tooltip
                        title={`The following represent different forms of the ${parameter.name} setting used for different tooling.`}
                      >
                        {parameter.name}
                      </Tooltip>
                    }
                  >
                    <Row>
                      {parameter.variations.map((variation, variationIndex) => (
                        <Col span={24} key={variationIndex}>
                          <Tooltip title={variation.tooltip}>
                            <p>
                              {variation.name}:{'  '} <InfoCircleOutlined />
                            </p>
                            {variation.value.map((val, valIndex) => (
                              <Button
                                size="small"
                                disabled={true}
                                style={{ margin: '5px' }}
                                key={valIndex}
                              >
                                {val}
                              </Button>
                            ))}
                          </Tooltip>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>
            QUANTAMM FREQUENTLY ASKED QUESTIONS
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row style={{ height: '110vh' }}>
        <Col span={1}></Col>
        <Col span={22}>
          <Row>
            <Col span={24}>
              <Card
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span>QUANTAMM REBALANCING</span>
                  </div>
                }
                style={{ height: '110vh', overflowY: 'auto' }}
              >
                    <Radio.Group
                        size="small"
                        buttonStyle="solid"
                        value={faqEli5}
                        onChange={(e) => setFAQEli5(e.target.value)}
                        style={{ fontWeight: 'normal', display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}
                    >
                        <Radio.Button value="ELI5" style={{ width: '100%' }}>ELI5</Radio.Button>
                        <Radio.Button value="Crypto Native" style={{ width: '100%' }}>
                            Crypto Native
                        </Radio.Button>
                    </Radio.Group>
                <Collapse
                  defaultActiveKey={['1']}
                  style={{
                    width: '100%',
                    backgroundColor: isDarkTheme ? '#162536' : '#fff',
                    marginTop: '10px',
                  }}
                  accordion
                  items={FAQItems.map((x) => {
                    return {
                      key: x.key,
                      label: x.label,
                      children: (
                        <>
                          <div hidden={faqEli5 != 'ELI5'}>
                            {x.eli5Description}
                          </div>
                          <div hidden={faqEli5 != 'Crypto Native'}>
                            {x.cryptoNativeDescription}
                          </div>
                          <div hidden={faqEli5 != 'Quant'}>
                            {x.quantDescription}
                          </div>
                        </>
                      ),
                    };
                  })}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
}
