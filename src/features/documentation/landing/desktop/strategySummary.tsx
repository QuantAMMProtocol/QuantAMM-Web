import { Button, Carousel, Col, Row, Typography } from "antd";
import { ProductItemBackground } from "../../../productExplorer/productItem/productItemBackground";
import { motion } from "framer-motion";
import { ROUTES } from "../../../../routesEnum";

const { Title } = Typography;

export function StrategySummary(){
    return <Row id="final_section_row">
      


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
                          loading="lazy"
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
            <Title style={{ textAlign: 'center', marginBottom:0}}>
              Adaptive Rebalancing Strategies
            </Title>
              <p
                  style={{
                    textAlign: 'center',
                    marginTop: '0px',
                  }}
              >
                  EXPLORE THE TRANSPARENT, AUTOMATIC MARKET STRATEGIES THAT RUN ON BTFS
              </p>
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
                    loading="lazy"
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
                    loading="lazy"
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
                          loading="lazy"
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
}