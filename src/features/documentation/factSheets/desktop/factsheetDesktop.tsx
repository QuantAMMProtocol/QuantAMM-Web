// TODO CH split into subcomponents
import { Button, Card, Col, Collapse, Row, Tooltip } from 'antd';
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
import ButtonGroup from 'antd/es/button/button-group';

interface FactsheetDesktopProps {
  model: FactsheetModel;
}

export function FactSheetDesktop(props: FactsheetDesktopProps) {
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

  const [period, setPeriod] = useState<string>(props.model.defaultPeriod[0]);

  const btf = useMemo(
    () => props.model.poolPrefix + `BTF${period}`,
    [period, props.model.poolPrefix]
  );
  const cfmm = useMemo(
    () => props.model.poolPrefix + `CFMM${period}`,
    [period, props.model.poolPrefix]
  );
  const hodl = useMemo(
    () => props.model.poolPrefix + `Hodl${period}`,
    [period, props.model.poolPrefix]
  );

  const btfTrain = useMemo(
    () => props.model.poolPrefix + `BTF${props.model.trainPeriod}`,
    [props.model.trainPeriod, props.model.poolPrefix]
  );
  const cfmmTrain = useMemo(
    () => props.model.poolPrefix + `CFMM${props.model.trainPeriod}`,
    [props.model.trainPeriod, props.model.poolPrefix]
  );
  const hodlTrain = useMemo(
    () => props.model.poolPrefix + `Hodl${props.model.trainPeriod}`,
    [props.model.trainPeriod, props.model.poolPrefix]
  );

  const periodSelector = (
    <Radio.Group
      onChange={(e) => setPeriod(e.target.value)}
      value={period}
      buttonStyle="solid"
      size="small"
    >
      <Radio.Button value={props.model.defaultPeriod[0]}>
        {props.model.defaultPeriod[1]}
      </Radio.Button>
      {props.model.alternatePeriod[0] !== '' ? (
        <Radio.Button value={props.model.alternatePeriod[0]}>
          {props.model.alternatePeriod[1]}
        </Radio.Button>
      ) : (
        <></>
      )}
    </Radio.Group>
  );

  const trainXAxisMonthInterval = useMemo(() => {
    return props.model.xAxisIntervals.get(props.model.trainPeriod);
  }, [props.model.trainPeriod, props.model.xAxisIntervals]);

  const xAxisMonthInterval = useMemo(() => {
    return props.model.xAxisIntervals.get(period);
  }, [period, props.model.xAxisIntervals]);

  return (
    <div>
      <Row>
        <Col span={1}></Col>
        <Col span={10}>
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
        <Col span={11}>
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
          <h1 style={{ marginLeft: '10px' }}>OVERVIEW</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{ height: '52vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row style={{ height: '100%' }}>
            <Col span={24}>
              <Card
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>GENERAL DETAILS</span>
                    <ButtonGroup>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          '/factsheet/example/' + props.model.poolId
                        )
                      }
                    >
                      View Simulation Results
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          '/product-explorer/' + props.model.poolChain + '/' + props.model.poolId
                        )
                      }
                    >
                      View Live Pool
                    </Button>
                    </ButtonGroup>
                  </div>
                }
                style={{ height: '100%' }}
              >
                <Row>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Col span={24}>
                      <h5
                        style={{
                          margin: 10,
                          width: '80%',
                          textAlign: 'center',
                        }}
                      >
                        Deployment Links
                      </h5>
                    </Col>
                    {props.model.deploymentLinks.contractLinks.map(
                      (link, index) => {
                        return (
                          <Col span={24} key={index}>
                            <Button
                              size="small"
                              style={{ margin: 10, width: '80%' }}
                              color="primary"
                            >
                              <a href={link[1]}>{link[0]}</a>
                            </Button>
                          </Col>
                        );
                      }
                    )}
                  </Col>
                  <Col span={10}>
                    <Col span={24}>
                      <h5
                        style={{
                          margin: 10,
                          width: '80%',
                          textAlign: 'center',
                        }}
                      >
                        Fixed Settings
                      </h5>
                    </Col>
                    {props.model.fixedSettings.map((setting, index) => {
                      return (
                        <Col span={24} key={index}>
                          <Button
                            size="small"
                            style={{
                              margin: 10,
                              width: '80%',
                              backgroundColor: 'transparent',
                              color: 'var(--tooltip-text-color)',
                            }}
                            disabled={true}
                          >
                            {setting[0]}: {setting[1]}
                          </Button>
                        </Col>
                      );
                    })}
                  </Col>
                  <Col span={2}></Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>COMPOSITION OVER TIME</span>
                {periodSelector}
              </div>
            }
            style={{ height: '100%' }}
          >
            <Row>
              <Col span={24} style={{ paddingTop: '30px' }}>
                <WeightChangeOverTimeGraph
                  simulationRunBreakdown={breakdowns[btf]}
                  overrideChartTheme={
                    isDarkTheme ? 'ag-default-dark' : 'ag-default'
                  }
                  overrideXAxisInterval={xAxisMonthInterval}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>CUMULATIVE PERFORMANCE</h1>
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
                }}
              >
                <span>SIMULATED BTF TOTAL $ VALUE OVER TIME</span>
                {periodSelector}
              </div>
            }
            style={{ margin: '5px' }}
          >
            <div hidden={loading}>
              <SimulationResultMarketValueChart
                hideTitle={true}
                overrideNagivagtion={false}
                breakdowns={
                  loading
                    ? []
                    : [breakdowns[btf], breakdowns[cfmm], breakdowns[hodl]]
                }
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
          <h1 style={{ marginLeft: '10px' }}>RE-WEIGHTING METHODOLOGY</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{ height: '80vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <Card
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>QUANTAMM REBALANCING</span>
                    <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      value={faqEli5}
                      onChange={(e) => setFAQEli5(e.target.value)}
                      style={{ fontWeight: 'normal' }}
                    >
                      <Radio.Button value="ELI5">ELI5</Radio.Button>
                      <Radio.Button value="Crypto Native">
                        Crypto Native
                      </Radio.Button>
                      <Radio.Button value="Quant">Quant</Radio.Button>
                    </Radio.Group>
                  </div>
                }
                style={{ height: '80vh', overflowY: 'auto' }}
              >
                <Collapse
                  defaultActiveKey={['1']}
                  style={{
                    width: '100%',
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
        <Col span={11}>
          <Row>
            <Col span={24} style={{ height: '100%' }}>
              <Card
                title="BTF RE-WEIGHT STRATEGY"
                style={{ height: '80vh', overflowY: 'auto' }}
              >
                {props.model.updateRule}
              </Card>
            </Col>
            <Col span={24}></Col>
          </Row>
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
                    }}
                  >
                    <span>SIMULATED FINANCIAL METRICS</span>
                    <Radio.Group
                      onChange={(e) => setPeriod(e.target.value)}
                      value={period}
                      buttonStyle="solid"
                      size="small"
                    >
                      <Radio.Button value={props.model.defaultPeriod[0]}>
                        {props.model.defaultPeriod[1]}
                      </Radio.Button>
                      {props.model.alternatePeriod[0] !== '' ? (
                        <Radio.Button value={props.model.alternatePeriod[0]}>
                          {props.model.alternatePeriod[1]}
                        </Radio.Button>
                      ) : (
                        <></>
                      )}
                    </Radio.Group>
                  </div>
                }
                style={{ margin: '5px' }}
              >
                <AnalysisSimplifiedBreakdownTable
                  simulationRunBreakdowns={
                    loading
                      ? []
                      : [breakdowns[btf], breakdowns[cfmm]]
                  }
                  benchmarkBreakdown={breakdowns[hodl]}
                  visibleMetrics={[
                    'Absolute Return (%)',
                    'Annualized Sharpe Ratio',
                    'Annualized Sortino Ratio',
                    'Annualized Information Ratio',
                    'Total Capture Ratio',
                    "Annualized Jensen's Alpha (%)",
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
          <h1 style={{ marginLeft: '10px' }}>KEY FACTS</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{ height: '130vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row style={{ height: '130vh' }}>
            <Col span={24}>
              <Card
                title="Advantages"
                style={{ height: '130vh', overflowY: 'auto' }}
              >
                <Row>
                  {props.model.advantages.map((advantage, index) => (
                    <Col span={12} key={index}>
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
        <Col span={11}>
          <Card style={{ height: '130vh', overflowY: 'auto' }} title={'Risks'}>
            <Row>
              {props.model.risks.map((risk, index) => (
                <Col span={12} key={index}>
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
      <Row style={{ height: '130vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Col span={24}>
            <Card
              title={props.model.trainingWindowTitle}
              style={{ height: '130vh' }}
            >
              <Row>
                <Col span={24}>
                  <div hidden={loading}>
                    <h5>Constituent weights over time</h5>
                    <WeightChangeOverTimeGraph
                      simulationRunBreakdown={breakdowns[btfTrain]}
                      overrideChartTheme={
                        isDarkTheme ? 'ag-default-dark' : 'ag-default'
                      }
                      overrideXAxisInterval={trainXAxisMonthInterval}
                    />
                    <h5>Cumulative performance over time</h5>
                    <SimulationResultMarketValueChart
                      hideTitle={true}
                      breakdowns={
                        loading
                          ? []
                          : [
                              breakdowns[btfTrain],
                              breakdowns[cfmmTrain],
                              breakdowns[hodlTrain],
                            ]
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
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
            <Card title={'Parameters Selected'} style={{ height: 'auto' }}>
            <Row>
              {props.model.trainedParameters.map((parameter, index) => (
              <Col span={12} key={index}>
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
    </div>
  );
}
