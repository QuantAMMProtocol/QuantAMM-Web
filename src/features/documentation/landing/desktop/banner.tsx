import { ParallaxLayer } from '@react-spring/parallax';
import { Col, Row, Tag, Tooltip } from 'antd';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title } = Typography;

export function Banner() {
  return (
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
            paddingTop: '55vh',
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
                    loading="lazy"
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
          <Col span={8} style={{ paddingTop: '2vh' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 3,
                delay: 1.2,
                scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
              }}
            >
              <h3 style={{ textAlign: 'center', marginBottom: 0 }}>
                Blockchain Traded Funds Launching Soon
              </h3>
              <Tag
                style={{ width: '100%', margin: '5px', textAlign: 'left' }}
              >
                <Row style={{ margin: 0, padding: 0 }}>
                  <Col span={4}>
                  <img src="/assets/safe_haven_BTF_icon_mono.png" style={{width: '100%', height: 'auto'}}/> 
                  </Col>
                  <Col span={20}>
                    <h3 style={{ margin: '5px' }}>The Safe Haven</h3>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      Follow trends of Bitcoin, PAXOS gold and T-Bills.
                    </p>{' '}
                  </Col>
                </Row>
              </Tag>

              <Tag
                style={{ width: '100%', margin: '5px', textAlign: 'center' }}
              >
                <Row style={{ margin: 0, padding: 0 }}>
                  <Col span={4}>
                  <img src="/assets/RWA_mono.png" style={{width: '100%', height: 'auto'}}/> 
                  </Col>
                  <Col span={20}>
                  <h3 style={{ margin: '5px' }}>The RWA Agnostic</h3>
                  <p style={{ margin: '5px' }}>
                    RWAs are the future, track RWA issuers to gain sector
                    exposure.
                  </p>
                  </Col>
                </Row>                
              </Tag>

              <Tag
                style={{ width: '100%', margin: '5px', textAlign: 'center' }}
              >
                <Row style={{ margin: 0, padding: 0 }}>
                  <Col span={4}>
                  <img src="/assets/sonic_BTF_icon.png" style={{width: '100%', height: 'auto'}}/> 
                  </Col>
                  <Col span={16}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <h3 style={{ margin: 0, textAlign: 'center' }}>Super Sonic Momentum</h3>
                    <p style={{ margin: 0, textAlign: 'center' }}>
                      The sonic ecosystem basket
                    </p>
                    </div>
                  </Col>
                  <Col span={4}>
                  <p style={{margin:0, padding:0, fontSize:'10px'}}>rBTC</p>
                  <p style={{margin:0, padding:0, fontSize:'10px'}}>rETH</p>
                  <p style={{margin:0, padding:0, fontSize:'10px'}}>rUSDC</p>
                  <p style={{margin:0, padding:0, fontSize:'10px'}}>rSOL</p>
                  </Col>
                </Row>
                
              </Tag>
              <p style={{ textAlign: 'right', margin: 0 }}>and more...</p>
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
                    loading="lazy"
                    style={{ width: '75%', height: '75%' }}
                    src="/background/secured_with_chainlink.png"
                  />
                </Tooltip>
              </div>
              <h3 style={{ textAlign: 'center' }}>Institutional Grade Data</h3>
            </motion.div>
          </Col>
          <Col span={2}></Col>
        </Row>
      </ParallaxLayer>
    </div>
  );
}
