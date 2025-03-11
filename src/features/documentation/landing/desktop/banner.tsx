import { ParallaxLayer } from "@react-spring/parallax";
import { Button, Col, Row, Tooltip } from "antd";
import { Typography } from "antd";
import { motion } from "framer-motion";


const { Title } = Typography;

export function Banner() {
    return  <div
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
                  loading="lazy"
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
}