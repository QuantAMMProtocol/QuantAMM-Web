import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { Col, Row, Tag, Tooltip } from 'antd';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { useEffect, useState } from 'react';
import { getBreakdown, Pool } from '../../../../services/breakdownService';

const { Title } = Typography;

export function Banner() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const productData = [
    {
      title: 'The RWA Agnostic',
      imgSrc: '/assets/RWA_mono.png',
      description: [
        'RWAs are the future',
        'Track RWA issuers.',
      ],
      status: 'Coming Soon',
      opacity: 0.4,
      imgWidth: '80%',
      focus:false
    },
    {
      title: 'The Safe Haven',
      imgSrc: '/assets/safe_haven_BTF_icon_mono.png',
      description: ['The doomsday BTF.', 'Bitcoin, PAXOS Gold, Dollar (USDC)'],
      status: 'Launching [Date]',
      opacity: 1,
      imgWidth: '90%',
      focus:true
    },
    {
      title: 'Super Sonic Momentum',
      imgSrc: '/assets/sonic_BTF_icon.png',
      description: [
        'The sonic ecosystem basket.',
        'Mega Cap Yield Focus'
      ],
      status: 'Coming Soon',
      opacity: 0.4,
      imgWidth: '80%',
      focus:false
    },
  ];

  useEffect(() => {
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<SimulationRunBreakdown[]> => {
      setLoading(true);
      const fetchedBreakdowns = await Promise.all(
        poolNames.map((poolName) => getBreakdown(poolName))
      );
      setBreakdowns(fetchedBreakdowns);
      return fetchedBreakdowns;
    };

    if (loading) {
      loadBreakdowns(['safeHavenBTF2025Test', 'safeHavenCFMM2025Test', 'safeHavenHodl2025Test'] as Pool[])
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [loading]);

  return (
    <Parallax
      pages={1}
      style={{
        height: 'calc(100vh - 40px)',
        backgroundPosition: 'center',
        position: 'relative',
        width: '100%',
        backgroundColor: '#352426',
        overflow: 'hidden',
      }}
    >
      <ParallaxLayer
        offset={0}
        speed={0}
        factor={1}
        style={{
          height: '95vh',
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
                  marginTop: '10px',
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
                DYNAMIC STRATEGY POOLS THAT CAPITALISE ON PRICE VOLATILITY WHILE
                STILL EARNING FEES AND YIELD
              </p>
            </motion.div>
          </Col>
          <Col span={4}></Col>
        </Row>
      </ParallaxLayer>
      <ParallaxLayer speed={0.04} factor={1}>
        <Row
          id="mission boxes"
          style={{
            paddingTop: '53vh',
            position: 'relative',
          }}
        >
          <Col span={4}></Col>
          <Col span={6} style={{ paddingTop: '6vh' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 3,
                delay: 1.2,
                scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              {productData.map((tag, index) => (
                <Tag
                  key={index}
                  style={{
                    width: '100%',
                    margin: '5px',
                    textAlign: 'center',
                    border: 'transparent',
                    backgroundColor: 'transparent',
                    opacity: tag.opacity,
                  }}
                >
                  <Row style={{ margin: 0, padding: 0 }}>
                    <Col span={4}>
                      <div
                        style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={tag.imgSrc}
                          style={{ width: tag.imgWidth, height: 'auto' }}
                          alt={tag.title}
                        />
                      </div>
                    </Col>
                    <Col span={20}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <h3 style={{ margin: '5px', textAlign: 'left' }}>
                          {tag.title + ' - ' + tag.status}
                        </h3>
                        {tag.description.map((desc, i) => (
                          <p
                            key={i}
                            style={{
                              textAlign: 'left',
                              margin: 0,
                              paddingLeft: '5px',
                            }}
                          >
                            {desc}
                          </p>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Tag>
              ))}
            </motion.div>
          </Col>
          <Col span={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 3,
                delay: 1.2,
                scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
              }}
              style={{ height: '100%' }}
            >
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                }}
              >
                <Row
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    marginTop: '30px',
                  }}
                >
                  <Col span={8}></Col>
                  <Col span={8}>
                    <Tooltip
                      title={
                        <>
                          <span style={{ textAlign: 'center', width: '100%' }}>
                            Built on Balancer V3
                          </span>
                          <br />
                          <span style={{ textAlign: 'center' }}>
                            Secured by Chainlink
                          </span>
                        </>
                      }
                    >
                      <img
                        loading="lazy"
                        style={{ width: '100%', height: 'auto' }}
                        src="/background/Balancerv3CL.png"
                      />
                    </Tooltip>
                  </Col>
                  <Col span={8}></Col>
                </Row>
              </div>
            </motion.div>
          </Col>
          <Col
            span={9}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              marginLeft: '-20px',
            }}
          >
            <SimulationResultMarketValueChart
              breakdowns={breakdowns}
              forceViewResults={true}
              overrideHeight={220}
              overrideXAxisInterval={1}
              overrideYAxisMax={11000000}
              overrideYAxisMin={85000000}
              overrideYAxisInterval={[9000000, 11000000]}
              overrideNagivagtion={false}
              overrideSeriesStrokeColor={{
                "Power Channel": '#c7b283',
                'Balancer Weighted': '#528aae',
                'HODL': '#52ad80',
              }}
              overrideSeriesName={{
                "Power Channel": 'QuantAMM',
                'Balancer Weighted' : 'Traditional DEX'
              }}
            />
          </Col>
          <Col span={1}></Col>
        </Row>
      </ParallaxLayer>
    </Parallax>
  );
}
