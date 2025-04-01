import { Button, Carousel, Col, Row, Typography } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { ROUTES } from '../../../../routesEnum';
import { useEffect, useState } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';

const { Title } = Typography;

export function StrategySummary() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCard, setVisibleCard] = useState<number>(0);

  const handleCarouselChange = (current: number) => {
    setVisibleCard(current);
  };

  const carouselRuleKeys = [
    'Momentum',
    'AntiMomentum',
    'Channel Following',
    'Power Channel',
    'Power Channel',
  ];

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
        'solExampleMomentum'
      , 'solExampleAntimomentum'
      , 'solExamplePowerChannel'
      , 'solExampleChannelFollowing'
      , 'solExampleHodl'
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
            <Col span={1}></Col>
            <Col span={6}>
              <div
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '15vh',
                }}
              >
                <h4 style={{ textAlign: 'center', margin: 0 }}>
                  ADAPTIVE STRATEGIES
                </h4>
                <p style={{ textAlign: 'center', margin: 0 }}>
                  FULLY DECENTRALISED, FULLY TRANSPARENT
                </p>
                <p style={{ textAlign: 'center', margin: 0 }}>
                  DO NOT TRUST OPAQUE MANAGERS
                </p>
                <Carousel
                  arrows={true}
                  autoplay={true}
                  autoplaySpeed={3000}
                  afterChange={handleCarouselChange}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: '20px',
                      }}
                    >
                      <img
                        loading="lazy"
                        style={{
                          width: '40%',
                          height: '40%',
                          padding: '15px',
                        }}
                        src="/documentation/vanilla_momentum.svg"
                      />
                      <h4 style={{ textAlign: 'center', marginBottom: 0 }}>
                        Trend Following
                      </h4>
                      <p style={{ textAlign: 'center', marginTop: 0 }}>
                        It&apos;s easier to buy high and sell higher than to buy
                        low and sell high
                      </p>
                      <Button
                        style={{ marginBottom: '10px' }}
                        type="primary"
                        size="small"
                        onClick={() =>
                          (window.location.href = `${ROUTES.DOCUMENTATION}/SimpleMomentum`)
                        }
                      >
                        View Momentum Documentation
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: '20px',
                      }}
                    >
                      <img
                        loading="lazy"
                        style={{
                          width: '50%',
                          height: '50%',
                        }}
                        src="/documentation/mean_reversion.svg"
                      />
                      <h4 style={{ textAlign: 'center', marginBottom: 0 }}>
                        Price Mean Reversion
                      </h4>
                      <p style={{ textAlign: 'center', marginTop: 0 }}>
                        deviations will revert back to the mean. Buy and sell
                        assuming prices will revert
                      </p>

                      <Button
                        style={{ marginBottom: '10px' }}
                        type="primary"
                        size="small"
                        onClick={() =>
                          (window.location.href = `${ROUTES.DOCUMENTATION}/AntiMomentum`)
                        }
                      >
                        View Mean Reversion Documentation
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: '20px',
                      }}
                    >
                      <img
                        loading="lazy"
                        style={{
                          width: '50%',
                          height: '50%',
                        }}
                        src="/documentation/channel_following.svg"
                      />
                      <h4 style={{ textAlign: 'center', marginBottom: 0 }}>
                        Channel Following
                      </h4>
                      <p style={{ textAlign: 'center', marginTop: 0 }}>
                        Capitalize on small movements but act fast on larger
                        movements
                      </p>
                      <Button
                        style={{ marginBottom: '10px' }}
                        type="primary"
                        size="small"
                        onClick={() =>
                          (window.location.href = `${ROUTES.DOCUMENTATION}/ChannelFollowing`)
                        }
                      >
                        View Channel Following Documentation
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: '20px',
                      }}
                    >
                      <img
                        loading="lazy"
                        style={{
                          width: '50%',
                          height: '50%',
                          padding: '15px',
                        }}
                        src="/documentation/power_channel.svg"
                      />
                      <h4 style={{ textAlign: 'center', marginBottom: 0 }}>
                        Power Channel
                      </h4>
                      <p style={{ textAlign: 'center', marginTop: 0 }}>
                        Ignore the noise of small price movements, act fast on
                        large price movements
                      </p>
                      <Button
                        style={{ marginBottom: '10px' }}
                        type="primary"
                        size="small"
                        onClick={() =>
                          (window.location.href = `${ROUTES.DOCUMENTATION}/PowerChannel`)
                        }
                      >
                        View Power Channel Documentation
                      </Button>
                    </div>
                  </div>
                </Carousel>
              </div>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={24} style={{ paddingTop: '40px' }}>
                  <h4 style={{ textAlign: 'center', margin: 0 }}>
                    Traditional DEX Pool Holdings
                  </h4>
                  <p style={{ textAlign: 'center', margin: 0 }}>
                    Focus on earning fees, ignore price movements
                  </p>
                  <div
                    style={{ paddingLeft: '80px', paddingRight: '80px' }}
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
                      overrideXAxisInterval={12}
                    />
                  </div>
                </Col>
                <Col span={24} style={{ paddingBottom: '40px' }}>
                  <h4 style={{ textAlign: 'center', margin: 0 }}>
                    QuantAMM BTF Pool Holdings
                  </h4>
                  <p style={{ textAlign: 'center', margin: 0 }}>
                    React to markets while earning fees.
                  </p>
                  <p style={{ textAlign: 'center', margin: 0 }}></p>
                  <div
                    style={{ paddingLeft: '80px', paddingRight: '80px' }}
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
                              carouselRuleKeys[visibleCard]
                        )[0]
                      }
                      overrideChartTheme="ag-default-dark"
                      overrideXAxisInterval={24}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={9}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingTop:'40px',
                  paddingBottom:'80px'
                }}
              >
                <SimulationResultMarketValueChart
                  breakdowns={breakdowns.filter(
                    (x) =>
                      x.simulationRun.updateRule.updateRuleName ==
                        carouselRuleKeys[visibleCard] ||
                      x.simulationRun.updateRule.updateRuleSimKey == 'hodl'
                  )}
                  forceViewResults={true}
                  overrideXAxisInterval={24}
                />
              </div>
            </Col>
          </Row>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}
