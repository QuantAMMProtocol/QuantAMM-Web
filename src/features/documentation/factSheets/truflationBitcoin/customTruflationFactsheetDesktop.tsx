import {
  Button,
  Card,
  Col,
  Collapse,
  Row,
  Space,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { Radio } from 'antd';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared/graphs/weightChangeOverTime';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';
import { AnalysisSimplifiedBreakdownTable } from '../../../simulationResults/breakdowns/simulationRunPerformanceSimpleTable';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks';
import { selectTheme } from '../../../themes/themeSlice';
import { FactsheetModel } from '../../landing/desktop/factsheetModel';
import { FAQItems } from '../../landing/faqItems';
import { SimulationResultDrawdownChart } from '../../../simulationResults/visualisations/simulationResultDrawdownGraph';
import ButtonGroup from 'antd/es/button/button-group';
import styles from '../factsheetDesktop.module.css';

interface FactsheetDesktopProps {
  model: FactsheetModel;
}

function FactsheetHeroObjectiveSection({ model }: FactsheetDesktopProps) {
  return (
    <Row>
      <Col span={1}></Col>
      <Col span={10}>
        <div className={styles.centeredHero}>
          <img
            src={model.factsheetImage.image}
            alt={model.factsheetImage.alt}
            style={{
              width: model.factsheetImage.width,
            }}
            className={styles.heroImage}
          />
          <h1 className={styles.heroTitle}>{model.mainTitle}</h1>
          <p className={styles.heroDescription}>{model.mainDescription}</p>
        </div>
      </Col>
      <Col span={1}></Col>
      <Col span={11}>
        <h4>BTF Objective</h4>
        <p>{model.objective}</p>
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
          strategies are not market-neutral and involve directional assumptions
          about asset allocation. Furthermore, the value of assets can be
          affected by macro economic factors and global events.
        </p>
      </Col>
      <Col span={1}></Col>
    </Row>
  );
}

type ExplorerView = 'drawdowns' | 'composition';

type TrainingView = 'drawdowns' | 'marketValue' | 'weightChange';

export function TruflationFactSheetDesktop(props: FactsheetDesktopProps) {
  const [breakdowns, setBreakdowns] = useState<
    Record<string, SimulationRunBreakdown>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [faqEli5, setFAQEli5] = useState('ELI5');

  const navigate = useNavigate();
  const isDarkTheme = useAppSelector(selectTheme);

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

  const [testPeriod, setTestPeriod] = useState<string>(props.model.defaultPeriod[0]);
  const [period, setPeriod] = useState<string>(props.model.trainPeriod);

  const btf = useMemo(
    () => props.model.poolPrefix + `BTF${testPeriod}`,
    [testPeriod, props.model.poolPrefix]
  );

  const hodl = useMemo(
    () => props.model.poolPrefix + `Hodl${testPeriod}`,
    [testPeriod, props.model.poolPrefix]
  );

  const btfTrain = useMemo(
    () => props.model.poolPrefix + `BTF${props.model.trainPeriod}`,
    [props.model.trainPeriod, props.model.poolPrefix]
  );

  const hodlTrain = useMemo(
    () => props.model.poolPrefix + `Hodl${props.model.trainPeriod}`,
    [props.model.trainPeriod, props.model.poolPrefix]
  );

  const [view, setView] = useState<ExplorerView>('drawdowns');

  const viewOptions = useMemo(
    () => [
      { label: 'Drawdowns', value: 'drawdowns' as const },
      { label: 'Composition', value: 'composition' as const },
    ],
    []
  );

  const [trainingView, setTrainingView] = useState<TrainingView>('drawdowns');

  const trainingViewOptions = useMemo(
    () => [
      { label: 'Drawdowns', value: 'drawdowns' as const },
      { label: 'Market value', value: 'marketValue' as const },
      { label: 'Weight change', value: 'weightChange' as const },
    ],
    []
  );

  const renderPeriodSelector = (includeTrainPeriod: boolean) => (
    <Radio.Group
      onChange={(e) => includeTrainPeriod ? setPeriod(e.target.value) : setTestPeriod(e.target.value)}
      value={includeTrainPeriod ? period : testPeriod}
      buttonStyle="solid"
      size="small"
    >
      {includeTrainPeriod &&
        props.model.trainPeriod &&
        props.model.trainPeriod !== props.model.defaultPeriod[0] &&
        props.model.trainPeriod !== props.model.alternatePeriod[0] && (
          <Radio.Button value={props.model.trainPeriod}>
            {props.model.trainingWindowTitle}
          </Radio.Button>
        )}
      <Radio.Button value={props.model.defaultPeriod[0]}>
        {props.model.defaultPeriod[1]}
      </Radio.Button>
      {props.model.alternatePeriod[0] !== '' ? (
        <Radio.Button value={props.model.alternatePeriod[0]}>
          {props.model.alternatePeriod[1]}
        </Radio.Button>
      ) : null}
    </Radio.Group>
  );


  const trainXAxisMonthInterval = useMemo(() => {
    return props.model.xAxisIntervals.get(props.model.trainPeriod);
  }, [props.model.trainPeriod, props.model.xAxisIntervals]);

  const xAxisMonthInterval = useMemo(() => {
    return props.model.xAxisIntervals.get(testPeriod);
  }, [testPeriod, props.model.xAxisIntervals]);
  console.log(breakdowns[btf]);
  return (
    <div>
      <FactsheetHeroObjectiveSection model={props.model} />
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 className={styles.sectionTitle}>
            TEST WINDOW (JAN-DEC 2025) PERFORMANCE
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row className={`${styles.rowHeight75} ${styles.rowMarginTop5}`}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row className={styles.fullHeight}>
            <Col span={24}>
              <Card
                title={
                  <div className={styles.titleRow}>
                    <span>STRATEGY DETAILS</span>
                    <ButtonGroup>
                      <Button
                        size="small"
                        onClick={() =>
                          navigate('/factsheet/example/' + props.model.poolId)
                        }
                      >
                        View Simulation Results
                      </Button>
                      <Button
                        disabled={props.model.status !== 'LIVE'}
                        size="small"
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
                    </ButtonGroup>
                  </div>
                }
                className={styles.cardHeightFull}
              >
                <div className={styles.scrollArea55}>
                  {props.model.updateRule}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>

        <Col span={11}>
          <Row className={styles.fullHeight}>
            <Col span={24}>
              <Card
                title={
                  <div className={`${styles.titleRow} ${styles.titleRowGap}`}>
                    <span>Test Window Strategy Explorer</span>

                    <Space size="middle">
                      <ButtonGroup>
                        {viewOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            size="small"
                            type={view === opt.value ? 'primary' : 'default'}
                            onClick={() => setView(opt.value as ExplorerView)}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </Space>
                  </div>
                }
                className={styles.cardHeightFull}
              >
                {view === 'drawdowns' ? (
                  <Row>
                    <Col span={1} />
                    <Col span={22}>
                      <SimulationResultDrawdownChart
                        breakdowns={
                          loading ? [] : [breakdowns[btf], breakdowns[hodl]]
                        }
                        forceViewResults={true}
                        hideTitle={true}
                      />
                    </Col>
                    <Col span={1} />
                  </Row>
                ) : (
                  <Row>
                    <Col span={24} className={styles.paddingTop30}>
                      <WeightChangeOverTimeGraph
                        simulationRunBreakdown={breakdowns[btf]}
                        overrideChartTheme={
                          isDarkTheme ? 'ag-default-dark' : 'ag-default'
                        }
                        overrideXAxisInterval={xAxisMonthInterval}
                      />
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <Card
            title={
              <div className={styles.titleRow}>
                <span>SIMULATED BTF TOTAL $ VALUE OVER TIME</span>
                {renderPeriodSelector(false)}
              </div>
            }
            className={styles.cardMarginSmall}
          >
            <div hidden={loading}>
              <SimulationResultMarketValueChart
                hideTitle={true}
                overrideNagivagtion={false}
                breakdowns={loading ? [] : [breakdowns[btf], breakdowns[hodl]]}
                overrideSeriesStrokeColor={
                  props.model.cumulativePerformanceOverrideSeriesStrokeColor
                }
                overrideSeriesName={
                  props.model.cumulativePerformanceOverrideSeriesName
                }
                overrideXAxisInterval={xAxisMonthInterval}
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
          <h1 className={styles.sectionTitle}>
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
      <Row className={styles.rowHeight110}>
        <Col span={1}></Col>
        <Col span={10}>
          <Col span={24}>
            <Card
              title={
                <div className={`${styles.titleRow} ${styles.titleRowGap}`}>
                  <span>{props.model.trainingWindowTitle}</span>
                </div>
              }
              className={styles.cardHeight110}
            >
              <Row>
                <Col span={24}>
                  <Space size="middle">
                    <ButtonGroup>
                      {trainingViewOptions.map((opt) => (
                        <Button
                          key={opt.value}
                          size="small"
                          type={
                            trainingView === opt.value ? 'primary' : 'default'
                          }
                          onClick={() =>
                            setTrainingView(opt.value as TrainingView)
                          }
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </Space>
                </Col>
              </Row>
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
                          overrideNagivagtion={false}
                          overrideXAxisInterval={trainXAxisMonthInterval}
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
                          overrideXAxisInterval={trainXAxisMonthInterval}
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
        <Col span={11}>
          <Card title={'Parameters Selected'} className={styles.cardHeightAuto}>
            <Row>
              {props.model.trainedParameters.map((parameter, index) => (
                <Col span={12} key={index}>
                  <Card
                    className={styles.cardMarginSmall}
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
                                className={styles.buttonMarginSmall}
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
          <h1 className={styles.sectionTitle}>
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
                  <div className={styles.titleRow}>
                    <span>SIMULATED FINANCIAL METRICS</span>
                    {renderPeriodSelector(true)}
                  </div>
                }
                className={styles.cardMarginSmall}
              >
                <AnalysisSimplifiedBreakdownTable
                  simulationRunBreakdowns={
                    loading
                      ? []
                      : period === props.model.trainPeriod
                        ? [breakdowns[btfTrain]]
                        : [breakdowns[btf]]
                  }
                  benchmarkBreakdown={
                    period === props.model.trainPeriod
                      ? breakdowns[hodlTrain]
                      : breakdowns[hodl]
                  }
                  visibleMetrics={[
                    'Absolute Return (%)',
                    "Annualized Jensen's Alpha (%)",
                    'Annualized Sharpe Ratio',
                    'Annualized Sortino Ratio',
                    'Annualized Information Ratio',
                    'Total Capture Ratio',
                  ]}
                  height={300}
                />
                <Row>
                  <Col span={10}>
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
                  <Col span={10}>
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
          <h1 className={styles.sectionTitle}>KEY FACTS</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row className={styles.rowHeight130}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row className={styles.rowHeight130}>
            <Col span={24}>
              <Card
                title="Advantages"
                className={styles.cardHeight130Scroll}
              >
                <Row>
                  {props.model.advantages.map((advantage, index) => (
                    <Col span={12} key={index}>
                      <Card
                        className={styles.cardMarginHeight57}
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
        <Col span={11}>
          <Card className={styles.cardHeight130Scroll} title={'Risks'}>
            <Row>
              {props.model.risks.map((risk, index) => (
                <Col span={12} key={index}>
                  <Card
                    className={styles.cardMarginHeight57}
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

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 className={styles.sectionTitle}>
            QUANTAMM FREQUENTLY ASKED QUESTIONS
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row className={styles.rowHeight80}>
        <Col span={1}></Col>
        <Col span={22}>
          <Row>
            <Col span={24}>
              <Card
                title={
                  <div className={styles.titleRow}>
                    <span>QUANTAMM REBALANCING</span>
                    <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      value={faqEli5}
                      onChange={(e) => setFAQEli5(e.target.value)}
                      className={styles.radioGroupNormal}
                    >
                      <Radio.Button value="ELI5">ELI5</Radio.Button>
                      <Radio.Button value="Crypto Native">
                        Crypto Native
                      </Radio.Button>
                      <Radio.Button value="Quant">Quant</Radio.Button>
                    </Radio.Group>
                  </div>
                }
                className={styles.cardHeight80Scroll}
              >
                <Collapse
                  defaultActiveKey={['1']}
                  className={styles.collapseBase}
                  style={{
                    backgroundColor: isDarkTheme ? '#162536' : '#fff',
                  }}
                  accordion
                  items={FAQItems.map((x) => {
                    return {
                      key: x.key,
                      label: x.label,
                      children: (
                        <>
                          <div hidden={faqEli5 !== 'ELI5'}>
                            {x.eli5Description}
                          </div>
                          <div hidden={faqEli5 !== 'Crypto Native'}>
                            {x.cryptoNativeDescription}
                          </div>
                          <div hidden={faqEli5 !== 'Quant'}>
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
