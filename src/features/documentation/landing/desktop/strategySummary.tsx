import { Button, Col, Row, Typography } from 'antd';
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
  const [strategy, setStrategy] = useState<string>("Momentum");

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
            <Col span={7}>
              <div
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '40px',
                  marginLeft:'20px'
                }}
              >
                <h4 style={{ textAlign: 'center', margin: 0 }}>
                  ADAPTIVE STRATEGIES
                </h4>
                <p style={{ textAlign: 'center', margin: 0 }}>
                  FULLY DECENTRALISED, FULLY TRANSPARENT
                </p>
                <Row gutter={[8,8]} style={{ marginTop: '2vh', padding: 0 }}>
                  <Col span={24} style={{ margin: 0, padding: 0 }}>
                  <Row>
                    <Col span={8}>
                    <div style={{justifyContent:'center', alignItems:'center'}}>
                      <img
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 'auto',
                          padding: '15px',
                        }}
                        src="/documentation/vanilla_momentum.svg"
                      />
                      </div>
                    </Col>
                    <Col span={13}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                      <Col span={24}><h4 style={{ margin: 0, padding: 0 }}>Momentum</h4></Col>
                      
                      <Col span={24}><p style={{ paddingRight:'10px' }}>
                      It&apos;s hard to buy low and sell high. It&apos;s easier to buy high and sell higher. Follow the trend.
                      </p>
                      </Col>
                      </div>
                    </Col>
                    <Col span={3}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                        <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                          setStrategy('Momentum')
                        }
                      >
                      Apply
                      </Button>
                      </div>
                      </Col>
                  </Row>
                  </Col>
                  <Col span={24} style={{ margin: 0, padding: 0 }}>
                  <Row>
                    <Col span={8}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                    <img
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        padding: '15px',
                      }}
                      src="/documentation/mean_reversion.svg"
                      />
                      </div>
                    </Col>
                    <Col span={13}>
                      <Col span={24}><h4 style={{ margin: 0, padding: 0 }}>Price Mean Reversion</h4></Col>
                      
                      <Col span={24}><p style={{ paddingRight:'10px' }}>
                      Deviations will revert back to the mean. Buy and sell assuming prices will revert
                      </p>
                      </Col>
                    </Col>
                  <Col span={3}>
                  <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                      <Button
                      type="primary"
                      size="small"
                      onClick={() =>
                      setStrategy('AntiMomentum')
                    }
                    >
                      Apply
                    </Button>
                    </div>
                    </Col>
                  </Row>
                  </Col>
                  <Col span={24} style={{ margin: 0, padding: 0 }}>
                  <Row>
                    <Col span={8}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                    <img
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        padding: '15px',
                      }}
                      src="/documentation/channel_following.svg"
                      />
                      </div>
                    </Col>
                    <Col span={13}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                      <Col span={24}><h4 style={{ margin: 0, padding: 0 }}>Channel Following</h4></Col>
                      
                      <Col span={24}><p style={{ paddingRight:'10px' }}>
                      Everything will revert to the mean on small movements but act fast on larger movements
                      </p></Col>
                      </div>
                    </Col>
                    <Col span={3}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() =>
                      setStrategy('Channel Following')
                      }
                    >
                      Apply
                    </Button>
                    </div>
                    </Col>
                  </Row>
                  </Col>
                  
                  <Col span={24} style={{ margin: 0, padding: 0 }}>
                  <Row>
                    <Col span={8}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                    <img
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        padding: '15px',
                      }}
                      src="/documentation/power_channel.svg"
                      />
                      </div>
                    </Col>
                    <Col span={13}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                      <Col span={24}><h4 style={{ margin: 0, padding: 0 }}>Power Channel</h4></Col>
                      <Col span={24}><p style={{ paddingRight:'10px' }}>
                      Ignore the noise of small price movements, act fast on large price movements
                      </p></Col>
                      </div>
                    </Col>
                    <Col span={3}>
                    <div style={{justifyContent:'center', alignContent:'center', height:'100%'}}>
                      <Button
                      type="primary"
                      size="small"
                      onClick={() =>                        
                          setStrategy('Power Channel')
                      }
                    >
                      Apply
                    </Button>
                    </div>
                    </Col>
                  </Row>
                  </Col>
                </Row>
                </div>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={24} style={{ paddingTop: '40px' }}>
                  <h4 style={{ textAlign: 'center', margin: 0,paddingLeft: '50px', paddingRight: '30px' }}>
                    Traditional DEX Pool Holdings
                  </h4>
                  <p style={{ textAlign: 'center', margin: 0,paddingLeft: '50px', paddingRight: '30px' }}>
                    Focus on earning fees, ignore price movements
                  </p>
                  <div
                    style={{ paddingLeft: '70px', paddingRight: '30px', marginTop:'2vh' }}
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
                      overrideXAxisInterval={24}
                    />
                  </div>
                </Col>
                <Col span={24} style={{ paddingBottom: '40px' }}>
                  <h4 style={{ textAlign: 'center', margin: 0,paddingLeft: '50px', paddingRight: '30px' }}>
                    QuantAMM BTF Pool Holdings
                  </h4>
                  <p style={{ textAlign: 'center', margin: 0,paddingLeft: '50px',paddingRight: '30px' }}>
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
                    strategy ||
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
