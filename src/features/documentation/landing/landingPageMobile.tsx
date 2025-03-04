import { Col, Row } from 'antd';
import { motion } from 'framer-motion';

export function LandingPageMobile() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Row style={{ width: '100%', height: '100%' }}>
        <Col span={24}>
          <div
            style={{
              backgroundImage: 'url(/background/Hourglass_Dune_80.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <Row>
              <Col span={24}>
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
                  <h2
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginBottom: '0px',
                      fontWeight: '400',
                    }}
                  >
                    MOVE BEYOND LIQUIDITY PROVIDING
                  </h2>
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
                      fontSize: '8px',
                    }}
                  >
                    CAPITALISE ON UNDERLYING PRICE MOVEMENTS WHILE STILL EARNING
                    FEES AND YIELD
                  </p>
                </motion.div>
              </Col>
            </Row>
            <Row
              id="mission boxes"
              style={{
                position: 'relative',
                marginTop: '20vh',
              }}
            >
              <Col
                span={10}
                style={{
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
                    <img
                      style={{ width: '70%', height: '70%' }}
                      src="/background/Balancerv3.png"
                    />
                    <p>Balancer V3 Launch Partner</p>
                  </div>
                </motion.div>
              </Col>
              <Col span={4}></Col>
              <Col
                span={10}
                style={{
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
                    <Row>
                      <Col span={24}>
                        <img
                          style={{ width: '85%', height: '85%' }}
                          src="/background/secured_with_chainlink.png"
                        />
                      </Col>
                      <Col span={24}>
                        <p>CHAINLINK BUILD</p>
                      </Col>
                    </Row>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default LandingPageMobile;
