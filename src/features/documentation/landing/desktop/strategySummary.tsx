import { Button, Col, Row, Tooltip, Typography } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { useEffect, useState } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';

const { Title } = Typography;

export function StrategySummary() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [strategy, setStrategy] = useState<string>('Momentum');

  const [autoCycle, setAutoCycle] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autoCycle) {
      const allStrageies = [
        'Momentum',
        'AntiMomentum',
        'Channel Following',
        'Power Channel',
      ];

      interval = setInterval(() => {
        setStrategy((prevStrategy) => {
          const currentIndex = allStrageies.indexOf(prevStrategy);
          const nextIndex = (currentIndex + 1) % allStrageies.length;
          return allStrageies[nextIndex];
        });
      }, 5000); // Change strategy every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoCycle]);

  // Effect to load breakdowns whenever the tab key changes
  useEffect(() => {
    // Function to load breakdowns based on the selected tab
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<SimulationRunBreakdown[]> => {
      setLoading(true); // Start loading
      const fetchedBreakdowns = await Promise.all(
        poolNames.map((poolName) => getBreakdown(poolName))
      );
      setBreakdowns(fetchedBreakdowns);
      return fetchedBreakdowns;
    };

    const loadData = async (): Promise<SimulationRunBreakdown[]> => {
      // Load breakdowns for the selected tab
      return await loadBreakdowns([
        'solExampleWeighted',
        'solExampleMomentum',
        'solExampleAntimomentum',
        'solExamplePowerChannel',
        'solExampleChannelFollowing',
        'solExampleHodl',
      ] as Pool[]); // Awaiting the asynchronous function here
    };

    if (loading) {
      loadData()
        .then((fetchedBreakdowns) => {
          setBreakdowns(fetchedBreakdowns);
        })
        .catch((error) => {
          console.error('Failed to load breakdowns:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setBreakdowns, setLoading, breakdowns, loading]);
  const strategies = [
    {
      title: 'Momentum',
      name: 'Momentum',
      image: '/documentation/vanilla_momentum.svg',
      description:
        "It's hard to buy low and sell high. It's easier to buy high and sell higher. Follow the trend.",
      imgWidth:'85%'
    },
    {
      title: 'Price Mean Reversion',
      name: 'AntiMomentum',
      image: '/documentation/mean_reversion.svg',
      description:
        'Deviations will revert back to the mean. Buy and sell assuming prices will revert.',
      imgWidth:'100%'
    },
    {
      title: 'Channel Following',
      name: 'Channel Following',
      image: '/documentation/channel_following.svg',
      description:
        'Everything will revert to the mean on small movements but act fast on larger movements.',
      imgWidth:'90%'
    },
    {
      title: 'Power Channel',
      name: 'Power Channel',
      image: '/documentation/power_channel.svg',
      description:
        'Ignore the noise of small price movements, act fast on large price movements.',
      imgWidth:'100%'
    },
  ];

  return (
    <Row id="final_section_row">
      <Col span={24}>
        <ProductItemBackground
          wide
          layers={20}
          backgroundColourOverride="#2c496b"
          borderColourOverride=""
        >
          <Row>
            <Col span={24}>
              <Title style={{ textAlign: 'center', marginBottom: 0 }}>
                EXPLORE QUANTAMM REVOLUTIONARY ARCHITECTURE
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '40px',
                  marginLeft: '20px',
                }}
              >
                <h4 style={{ textAlign: 'center', margin: 0 }}>
                  ADAPTIVE STRATEGIES
                </h4>
                <p style={{ textAlign: 'center', margin: 0 }}>
                  FULLY DECENTRALISED, FULLY TRANSPARENT
                </p>
                <Row gutter={[8, 8]} style={{ marginTop: '2vh', padding: 0 }}>
                  {strategies.map((strategyItem) => (
                    <Col
                      span={24}
                      style={{ margin: 0, padding: 0, height: '100%' }}
                      key={strategyItem.name}
                      
                    >
                      <Row style={{marginTop:'2vh'}}>
                        <Col span={8}>
                          <div
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              loading="lazy"
                              style={{
                                width: strategyItem.imgWidth,
                                height: 'auto',
                                padding: '15px',
                              }}
                              src={strategyItem.image}
                            />
                          </div>
                        </Col>
                        <Col span={16}>
                            <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                            }}
                            >
                            <Tooltip title={strategyItem.description}>
                              <Button
                              disabled={strategy === strategyItem.name}
                              size="small"
                              style={{
                                width: '100%',
                                height: '60%',
                                backgroundColor:
                                strategy === strategyItem.name
                                  ? '#c7b283'
                                  : undefined,
                                color:
                                strategy === strategyItem.name
                                  ? '#2c496b'
                                  : undefined,
                              }}
                              onClick={() => {
                                setStrategy(strategyItem.name);
                                setAutoCycle(false);
                              }}
                              >
                              {strategyItem.title}
                              </Button>
                            </Tooltip>
                            </div>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
            <Col span={10}>
              <Row>
                <Col span={24} style={{ paddingTop: '40px' }}>
                  <h4
                    style={{
                      textAlign: 'center',
                      margin: 0,
                      paddingLeft: '50px',
                      paddingRight: '30px',
                    }}
                  >
                    Traditional DEX Pool Holdings
                  </h4>
                  <p
                    style={{
                      textAlign: 'center',
                      margin: 0,
                      paddingLeft: '50px',
                      paddingRight: '30px',
                    }}
                  >
                    Focus on earning fees, ignore price movements
                  </p>
                  <div
                    style={{
                      paddingLeft: '70px',
                      paddingRight: '30px',
                      marginTop: '2vh',
                    }}
                    hidden={
                      (loading && breakdowns.length == 0) ||
                      breakdowns.filter(
                        (x) =>
                          x.simulationRun.updateRule.updateRuleName ==
                          'Balancer Weighted'
                      ).length == 0
                    }
                  >
                    <WeightChangeOverTimeGraph
                      simulationRunBreakdown={
                        breakdowns.filter(
                          (x) =>
                            x.simulationRun.updateRule.updateRuleName ==
                            'Balancer Weighted'
                        )[0]
                      }
                      overrideChartTheme="ag-default-dark"
                      overrideXAxisInterval={22}
                    />
                  </div>
                </Col>
                <Col span={24}>
                  <h4
                    style={{
                      textAlign: 'center',
                      margin: 0,
                      paddingLeft: '50px',
                      paddingRight: '30px',
                    }}
                  >
                    QuantAMM{' '}
                    <span style={{ color: '#c7b283' }}>
                      {strategy == 'AntiMomentum'
                        ? 'Price Reversion'
                        : strategy}
                    </span>{' '}
                    Pool Holdings
                  </h4>
                  <p
                    style={{
                      textAlign: 'center',
                      margin: 0,
                      paddingLeft: '50px',
                      paddingRight: '30px',
                    }}
                  >
                    React to markets while earning fees.
                  </p>
                  <div
                    style={{ paddingLeft: '70px', paddingRight: '30px' }}
                    hidden={
                      (loading && breakdowns.length == 0) ||
                      breakdowns.filter(
                        (x) =>
                          x.simulationRun.updateRule.updateRuleName ==
                          'Balancer Weighted'
                      ).length == 0
                    }
                  >
                    <WeightChangeOverTimeGraph
                      simulationRunBreakdown={
                        breakdowns.filter(
                          (x) =>
                            x.simulationRun.updateRule.updateRuleName ==
                            strategy
                        )[0]
                      }
                      overrideChartTheme="ag-default-dark"
                      overrideXAxisInterval={22}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingTop: '20px',
                }}
              >
                <SimulationResultMarketValueChart
                  breakdowns={breakdowns.filter(
                    (x) =>
                      x.simulationRun.updateRule.updateRuleName == strategy ||
                      x.simulationRun.updateRule.updateRuleName == 'Balancer Weighted'
                  )}
                  forceViewResults={true}
                  overrideXAxisInterval={24}
                  overrideSeriesStrokeColor={{
                    Momentum: '#c7b283',
                    AntiMomentum: '#c7b283',
                    'Channel Following': '#c7b283',
                    'Power Channel': '#c7b283',
                    'Balancer Weighted': '#528aae',
                  }}
                  overrideSeriesName={{
                    Momentum: 'QuantAMM',
                    AntiMomentum: 'QuantAMM',
                    'Channel Following': 'QuantAMM',
                    'Power Channel': 'QuantAMM',
                    'Balancer Weighted' : 'Traditional DEX'
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ margin: 0, padding: 0 }}>
            <Col span={24} style={{ padding: 0, margin: 0 }}>
              <div
                style={{
                  textAlign: 'center',
                  paddingBottom: '5vh',
                  paddingRight: '80px',
                }}
              >
                <Button size="small" onClick={() => setAutoCycle(!autoCycle)}>
                  {autoCycle ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </Col>
          </Row>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}
