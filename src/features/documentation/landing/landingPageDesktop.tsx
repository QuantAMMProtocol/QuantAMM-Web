import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Carousel,
  Col,
  Row,
  Steps,
  Tooltip,
  Typography,
} from 'antd';
import {
  BarChartOutlined,
  BlockOutlined,
  BuildOutlined,
  CheckOutlined,
  FundViewOutlined,
  HourglassOutlined,
  LoadingOutlined,
  NodeIndexOutlined,
  PieChartOutlined,
  ReadOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { ProductItemBackground } from '../../productExplorer/productItem/productItemBackground';
import { motion } from 'framer-motion';
import { getBreakdown, Pool } from '../../../services/breakdownService';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { WeightChangeOverTimeGraph } from '../../shared/graphs/weightChangeOverTime';
import { ROUTES } from '../../../routesEnum';
import { SimulationRunner } from '../../simulationRunner/simulationRunner';

const { Title } = Typography;

const articleCardGridStyle: React.CSSProperties = {
  width: '33.33%',
  textAlign: 'center',
  padding: '10px',
};

export function LandingPageDesktop() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      console.log('Fetched breakdowns:', fetchedBreakdowns);
      setBreakdowns(fetchedBreakdowns);
      console.log('Breakdowns:', breakdowns);
      return fetchedBreakdowns;
    };

    const loadData = async (): Promise<SimulationRunBreakdown[]> => {
      // Load breakdowns for the selected tab
      return await loadBreakdowns([
        'balancerWeighted',
        'quantAMMAntiMomentum',
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
    console.log('Breakdowns:', breakdowns);
  }, [setBreakdowns, setLoading, breakdowns, loading]);

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Parallax
        pages={18}
        id="parallax_container"
        style={{ height: '95vh', width: '100%', position: 'relative' }}
      >
        <div
          style={{
            height: '95vh',
            backgroundPosition: 'center',
            position: 'relative',
            width: '100%',
            backgroundColor: '#352426',
          }}
        >
          <ParallaxLayer
            offset={0}
            speed={0}
            factor={1}
            style={{
              height: '80vh',
              backgroundImage: 'url(./background/Hourglass_Dune_80.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <Row>
              <Col span={4}></Col>
              <Col span={16}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    decelerate: 100,
                  }}
                  transition={{
                    duration: 3,
                    scale: { type: 'spring', visualDuration: 2, bounce: 0.1 },
                  }}
                >
                  <Title
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginBottom: '0px',
                      fontWeight: '400',
                    }}
                  >
                    MOVE BEYOND LIQUIDITY PROVIDING
                  </Title>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, decelerate: 3 }}
                  transition={{
                    duration: 3,
                    delay: 1,
                    scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
                  }}
                >
                  <p
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginTop: '0px',
                    }}
                  >
                    CAPITALISE ON UNDERLYING PRICE MOVEMENTS WHILE STILL EARNING
                    FEES AND YIELD
                  </p>
                </motion.div>
              </Col>
              <Col span={4}></Col>
            </Row>
          </ParallaxLayer>
          <ParallaxLayer speed={0.04} factor={1}>
            <Row
              id="mission boxes"
              gutter={[16, 16]}
              style={{
                paddingTop: '52vh',
                position: 'relative',
              }}
            >
              <Col span={2}></Col>
              <Col
                span={5}
                style={{
                  paddingTop: '5vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 3,
                    delay: 1.2,
                    scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Balancer V3 Launch Partner">
                      <img
                        style={{ width: '50%', height: '50%' }}
                        src="/background/Balancerv3.png"
                      />
                    </Tooltip>
                  </div>
                  <h3 style={{ textAlign: 'center' }}>
                    Secure Vault Infrastructure
                  </h3>
                </motion.div>
              </Col>
              <Col span={1}></Col>
              <Col span={8} style={{ paddingTop: '5vh' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 3,
                    delay: 1.2,
                    scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
                  }}
                >
                  <h3 style={{ textAlign: 'center' }}>
                    Available Blockchain Traded Funds
                  </h3>
                  <Button style={{ width: '100%', margin: '10px' }}>
                    Mega Cap 30 day Trend BTF: BTC/ETH/SOL/XRP/USDC
                  </Button>
                  <Button style={{ width: '100%', margin: '10px' }}>
                    Meme 7 day Trend BTF: DOGE/SHIB/PEPE/USDC
                  </Button>
                  <Button style={{ width: '100%', margin: '10px' }}>
                    Safe Haven 30 day Trend BTF: BTC / PAXG / XAUt/ USDC
                  </Button>
                </motion.div>
              </Col>
              <Col span={1}></Col>
              <Col
                span={5}
                style={{
                  paddingTop: '5vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 3,
                    delay: 1.2,
                    scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="CHAINLINK BUILD program member">
                      <img
                        style={{ width: '75%', height: '75%' }}
                        src="/background/secured_with_chainlink.png"
                      />
                    </Tooltip>
                  </div>
                  <h3 style={{ textAlign: 'center' }}>
                    Institutional Grade Data
                  </h3>
                </motion.div>
              </Col>
              <Col span={2}></Col>
            </Row>
          </ParallaxLayer>
        </div>
        <ParallaxLayer
          sticky={{ start: 1, end: 2 }}
          factor={1}
          style={{ backgroundColor: 'white' }}
        >
          <ProductItemBackground
            wide={true}
            layers={20}
            backgroundColourOverride="#FFFEF2"
            borderColourOverride="#f6f4ef"
          >
            <Row id={'quantamm_game_changers'}>
              <Col span={24}>
                <Title
                  style={{
                    color: '#162536',
                    textAlign: 'center',
                    marginBottom: 0,
                  }}
                >
                  QuantAMM Pools: Blockchain Traded Funds
                </Title>
              </Col>
            </Row>
            <Row style={{ marginTop: '5vh' }}>
              <Col span={1}></Col>
              <Col
                span={7}
                style={{ padding: '5vh', height: '30vh', paddingTop: '10px' }}
              >
                <div style={{ marginTop: '10vh' }}>
                  <img
                    style={{
                      width: '80%',
                      height: '80%',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    src="/background/blueSand.png"
                  />
                </div>
                <h2 style={{ color: 'red', textAlign: 'center' }}>FACT</h2>
                <h3 style={{ color: 'red', textAlign: 'center' }}>
                  {' '}
                  Crypto markets are volatile and cyclical
                </h3>
              </Col>
              <Col
                span={8}
                style={{ padding: '5vh', height: '30vh', paddingTop: '10px' }}
              >
                <Col span={24}>
                  <h4
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Traditional DEX Pool Holdings
                  </h4>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Focus on earning trading swap fees and ignore price
                    movements
                  </p>
                  <div
                    style={{ padding: 0 }}
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
                      overrideChartTheme="ag-default"
                      overrideXAxisInterval={12}
                    />
                  </div>
                </Col>
                <Col span={24}>
                  <h4
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    QuantAMM BTF Pool Holdings
                  </h4>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Rebalance holdings to capitalise on prices WHILE still
                    earning fees
                  </p>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  ></p>
                  <div
                    style={{ padding: 0 }}
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
                            'AntiMomentum'
                        )[0]
                      }
                      overrideChartTheme="ag-default"
                      overrideXAxisInterval={12}
                    />
                  </div>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0',
                  }}
                >
                  <Button
                    type="primary"
                    onClick={() => (window.location.href = ROUTES.EXAMPLES)}
                  >
                    View Example Simulations
                  </Button>
                </Col>
              </Col>
              <Col
                span={7}
                style={{ padding: '5vh', height: '30vh', paddingTop: '10px' }}
              >
                <Col span={24} style={{ marginTop: '6vh' }}>
                  <h3
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Broad baskets and Themes
                    <CheckOutlined
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </h3>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    No need to be a blockchain and protocol expert
                  </p>
                </Col>
                <Col span={24} style={{ marginTop: '5vh' }}>
                  <h3
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Fire and forget
                    <CheckOutlined
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </h3>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Automatic and fully on-chain, daily rebalancing
                  </p>
                </Col>
                <Col span={24} style={{ marginTop: '5vh' }}>
                  <h3
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Low fees
                    <CheckOutlined
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </h3>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    No streaming maintenance fees on deposits.
                  </p>
                </Col>
                <Col span={24} style={{ marginTop: '5vh' }}>
                  <h3
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Trustless
                    <CheckOutlined
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </h3>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    No off-chain stack, no annonymous manager.
                  </p>
                </Col>
                <Col span={24} style={{ marginTop: '5vh' }}>
                  <h3
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Simplicity
                    <CheckOutlined
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </h3>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    No moving liquidity. No complex trade routing.
                  </p>
                </Col>
                <Col span={24} style={{ marginTop: '5vh' }}>
                  <h3
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Known strategies
                    <CheckOutlined
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </h3>
                  <p
                    style={{ color: '#162536', textAlign: 'center', margin: 0 }}
                  >
                    Know exposure origins. Simulate performance and risk.
                  </p>
                </Col>
              </Col>
              <Col span={1} style={{ paddingTop: '10px' }}></Col>
            </Row>
          </ProductItemBackground>
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.4}
          factor={1}
          sticky={{ start: 3, end: 5 }}
          style={{
            backgroundColor: '#FFFEF2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Row id="final_section_row">
            <Col span={24}>
              <ProductItemBackground
                wide
                layers={20}
                backgroundColourOverride="#2c496b"
                borderColourOverride=""
              >
                <Row>
                  <Col span={7}>
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{
                            duration: 0.4,
                            scale: {
                              type: 'spring',
                              visualDuration: 0.4,
                              bounce: 0.5,
                            },
                          }}
                        >
                          <Row>
                            <Col span={24}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'right',
                                }}
                              >
                                <img
                                  style={{
                                    width: '42%',
                                    height: '42%',
                                    marginTop: '11vh',
                                    marginRight: '5vh',
                                  }}
                                  src="/background/bear.png"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'right',
                                }}
                              >
                                <p
                                  style={{
                                    marginRight: '8vh',
                                    marginTop: 0,
                                  }}
                                >
                                  De-risk in bear markets
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </motion.div>
                      </div>
                    </div>
                  </Col>
                  <Col span={10}>
                    <Title style={{ textAlign: 'center' }}>
                      Adaptive Rebalancing Strategies
                    </Title>
                    <Carousel
                      arrows={true}
                      autoplay={true}
                      autoplaySpeed={3000}
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
                            It&apos;s easier to buy high and sell higher than to
                            buy low and sell high
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
                            deviations will revert back to the mean. Buy and
                            sell assuming prices will revert
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
                            style={{
                              width: '40%',
                              height: '40%',
                              padding: '15px',
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
                            Ignore the noise of small price movements, act fast
                            on large price movements
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
                            style={{
                              width: '65%',
                              height: '65%',
                              marginBottom: '4vh',
                            }}
                            src="/documentation/minimum_variance.svg"
                          />
                          <h4 style={{ textAlign: 'center', marginBottom: 0 }}>
                            Minimum Variance
                          </h4>
                          <p style={{ textAlign: 'center', marginTop: 0 }}>
                            The asset with the least volatility is what you want
                            to hold the most of.
                          </p>
                          <Button
                            style={{ marginBottom: '10px' }}
                            type="primary"
                            size="small"
                            onClick={() =>
                              (window.location.href = `${ROUTES.DOCUMENTATION}/MinVariance`)
                            }
                          >
                            View Minimum Variance Documentation
                          </Button>
                        </div>
                      </div>
                    </Carousel>
                  </Col>
                  <Col span={7}>
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{
                            duration: 0.4,
                            scale: {
                              type: 'spring',
                              visualDuration: 0.4,
                              bounce: 0.5,
                            },
                          }}
                        >
                          <Row>
                            <Col span={24}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                }}
                              >
                                <img
                                  style={{
                                    width: '45%',
                                    height: '45%',
                                    marginTop: '10vh',
                                    marginLeft: '2vh',
                                  }}
                                  src="/background/bull.png"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'left',
                                }}
                              >
                                <p
                                  style={{
                                    marginLeft: '4vh',
                                    marginTop: 0,
                                  }}
                                >
                                  Increase exposure in bull markets
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </motion.div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </ProductItemBackground>
            </Col>
          </Row>
        </ParallaxLayer>
        <ParallaxLayer
          speed={0.1}
          sticky={{ start: 6, end: 8 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundImage: 'url(./background/sand_background.png)',
            height: '100%',
          }}
        >
          <Row
            style={{
              height: '100%',
              marginTop: '5vh',
            }}
          >
            <Col span={24}>
              <div style={{ justifyContent: 'center' }}>
                <Row style={{ marginTop: '5vh' }}>
                  <Col span={24}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Card
                        title="Explore the bleeding-edge research that makes QuantAMM possible"
                        style={{ width: '90%' }}
                      >
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="A detailed explanation of the underlying AMM mechanism that makes QuantAMM possible">
                            <PieChartOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4 style={{ marginTop: '10px' }}>
                              Temporal Function Market Making Litepaper
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf"
                            size="small"
                          >
                            View Full Paper
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="Blockchain Traded Funds: their construction, strategy tuning and application">
                            <HourglassOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>QuantAMM Protocol Litepaper</h4>
                          </Tooltip>
                          <Button
                            href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf"
                            size="small"
                          >
                            View Full Paper
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="A comparison of TFMM rebalancing for fund managers compared to running CEX portfolios">
                            <BarChartOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>
                              RVR - Improving the fidelity of
                              Loss-versus-Rebalancing
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf"
                            size="small"
                          >
                            View Full Paper
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="Linear interpolation between two target weights is Efficient. This paper explores further efficiencies available in non-linear rebalancing mechanisms">
                            <NodeIndexOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>Optimal Rebalancing in Dynamic AMMs</h4>
                          </Tooltip>
                          <Button
                            href="https://arxiv.org/abs/2403.18737"
                            size="small"
                          >
                            View Full Paper
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="For N-token trades, convex solvers have been required to find the optimal trade. This paper provides a closed-form solution for arbitrage.">
                            <SwapOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>
                              Closed-form solutions for generic N-token AMM
                              arbitrage
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://arxiv.org/abs/2402.06731"
                            size="small"
                          >
                            View Full Paper
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="Dynamic weight AMMs provide a multiblock MEV opportunity. This paper outlines the types of protections required to prevent further loss">
                            <BuildOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>
                              Multiblock MEV opportunities & protections in
                              dynamic AMMs
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://arxiv.org/abs/2404.15489"
                            size="small"
                          >
                            View Full Paper
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="An overview on TFMM mechanisms and why asset management is the primary focus">
                            <BlockOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>
                              The use of AMM forumlas outside of core liquidity
                              providing
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://medium.com/@QuantAMM/temporal-function-market-making-tfmm-the-use-of-amms-outside-of-core-liquidity-providing-bc403e76b97"
                            size="small"
                          >
                            View Article
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="Comparing the current DeFi evolution to TradFi and where BTFs fit in">
                            <FundViewOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>
                              The State of Asset Management in DeFi and the BTF
                              Revolution
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://medium.com/@QuantAMM/the-state-of-asset-management-in-defi-and-the-btf-revolution-5622abf9920a"
                            size="small"
                          >
                            View Article
                          </Button>
                        </Card.Grid>
                        <Card.Grid style={articleCardGridStyle}>
                          <Tooltip title="TFMMs are one new approach to AMMs. This article explores other approaches and their trade-offs">
                            <ReadOutlined
                              style={{ fontSize: '60px', marginTop: '10px' }}
                            />
                            <h4>
                              Looking back at AMMs of 2023: Innovations and new
                              approaches
                            </h4>
                          </Tooltip>
                          <Button
                            href="https://medium.com/@QuantAMM/looking-back-at-amms-of-2023-innovations-and-new-approaches-834d373b4f3b"
                            size="small"
                          >
                            View Article
                          </Button>
                        </Card.Grid>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </ParallaxLayer>

        <ParallaxLayer
          factor={1}
          sticky={{ start: 9, end: 11 }}
          style={{
            height: '100%',
          }}
        >
          <Row style={{ height: '100%' }}>
            <Col span={24}>
              <ProductItemBackground
                wide
                layers={20}
                backgroundColourOverride="#2c496b"
                borderColourOverride=""
              >
                <Row>
                  <Col span={2}></Col>
                  <Col
                    span={8}
                    style={{ paddingLeft: '20px', paddingRight: '20px' }}
                  >
                    <Row>
                      <Col span={24}>
                        <div
                          style={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '100%',
                            padding: '20px',
                            marginTop: '8vh',
                            alignItems: 'center',
                          }}
                        >
                          <h2>OUR VISION</h2>
                          <p>
                            At QuantAMM, our vision is to build a passive fund
                            product that everyone can understand and everyone
                            can access. There has been decades of TradFi passive
                            product innovations. While ETFs with BTC/ETH are
                            coming, we go one step further and bring generic
                            fund construction infrastructure on chain:
                          </p>
                          <p>
                            Real World Savings for investors and institutions by
                            running funds on-chain
                          </p>
                          <p>
                            Our belief and all our research shows that all of
                            the above can only be achieved with a new form of
                            passive AMM:
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6} style={{ marginTop: '5vh' }}>
                    <img
                      style={{
                        width: '75%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                        borderRadius: '45%',
                      }}
                      src="/companies/matthew-willetts.jpg"
                    />
                    <h3>Matthew Willetts</h3>
                    <p>Founder & CEO</p>
                    <h5 style={{ margin: 0 }}>Previous experience:</h5>
                    <p style={{ margin: 0 }}>CS Research Fellow @ UCL</p>
                    <p style={{ margin: 0 }}>
                      PhD in statistics & machine learning @ Oxford
                    </p>
                    <p style={{ margin: 0 }}>
                      AI consultant: clients including IDEO and Ford
                    </p>
                    <p style={{ margin: 0 }}>
                      Catastrophe modelling @ Risk Management Solutions
                    </p>
                    <p style={{ margin: 0 }}>BA Natural Sciences @ Cambridge</p>
                  </Col>
                  <Col span={6} style={{ marginTop: '5vh' }}>
                    <img
                      style={{
                        width: '75%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                        borderRadius: '45%',
                      }}
                      src="/companies/christian.jpg"
                    />
                    <h3>Christian Harrington</h3>
                    <p>Founder & CTO</p>
                    <h5 style={{ margin: 0 }}>Previous experience:</h5>
                    <p style={{ margin: 0 }}>
                      Central OMS technical architect @ Man Group
                    </p>
                    <p style={{ margin: 0 }}>
                      Ops and compliance tech project lead @ Man Group
                    </p>
                    <p style={{ margin: 0 }}>
                      Full stack engineering on LME, LSE, ICE systems
                    </p>
                    <p style={{ margin: 0 }}>
                      Low latency data feed engineering in C++
                    </p>
                    <p style={{ margin: 0 }}>BA Natural Sciences @ Cambridge</p>
                  </Col>
                  <Col span={2}></Col>
                </Row>
                <Row>
                  <Col span={4}></Col>
                  <Col span={16}>
                    <Steps
                      style={{ marginTop: '5vh' }}
                      current={4}
                      items={[
                        {
                          title: 'H1 2023',
                          description: 'Simulator Build',
                        },
                        {
                          title: 'H2 2023',
                          description:
                            'Protocol Build and ToB in progress audit',
                        },
                        {
                          title: 'H1 2024',
                          description: 'Balancer V3 Build Conversion',
                        },
                        {
                          title: 'H2 2024',
                          description:
                            'Cyfrin/Codehawks audits awaiting V3 launch',
                        },
                        {
                          title: 'March/April 2025',
                          description: 'QuantAMM Launches BTF',
                          icon: <LoadingOutlined />,
                        },
                      ]}
                    />
                  </Col>
                  <Col span={4}></Col>
                </Row>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5vh',
                  }}
                >
                  <Col span={4}></Col>
                  <Col span={1}>
                    <img
                      style={{
                        width: '90%',
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto',
                      }}
                      src="/companies/8vc.png"
                    />
                  </Col>
                  <Col span={1}>
                    <img
                      style={{
                        width: '80%',
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto',
                      }}
                      src="/companies/369.png"
                    />
                  </Col>
                  <Col span={2}>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                      }}
                      src="/companies/BalancerV3.png"
                    />
                  </Col>
                  <Col span={2}>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                      }}
                      src="/companies/chainlink_build.png"
                    />
                  </Col>
                  <Col span={1}>
                    <img
                      style={{
                        width: '75%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                      }}
                      src="/companies/Mako.png"
                    />
                  </Col>
                  <Col span={2}>
                    <img
                      style={{
                        width: '90%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                      }}
                      src="/companies/longhashx.png"
                    />
                  </Col>
                  <Col span={1}>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                      }}
                      src="/companies/Marshland.png"
                    />
                  </Col>
                  <Col span={2}>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '5 auto',
                        justifyContent: 'center',
                      }}
                      src="/companies/Codehawks.png"
                    />
                  </Col>
                  <Col span={1}>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '10 auto',
                      }}
                      src="/companies/Cyfrin.png"
                    />
                  </Col>
                  <Col span={1}>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '20 auto',
                      }}
                      src="/companies/Hypernest.png"
                    />
                  </Col>
                  <Col span={4}></Col>
                </Row>
              </ProductItemBackground>
            </Col>
          </Row>
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.4}
          sticky={{ start: 12, end: 14 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#162536',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ height: '100%', width: '100%' }}>
            {' '}
            <SimulationRunner />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.4}
          sticky={{ start: 15, end: 18 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#162536',
            justifyContent: 'flex-start',
          }}
        >
          {/* Contact Us */}
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="/assets/colour_ts.png"
              alt="QuantAMM"
              style={{ width: '100px', height: 'auto' }}
            />
            <Title level={3}>Contact Us</Title>
            <p>Email: info@quantamm.fi</p>
            <p>Twitter: @QuantAMMDefi</p>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default LandingPageDesktop;
