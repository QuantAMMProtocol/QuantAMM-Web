import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { Col, Row } from 'antd';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import {
  BannerProductSection,
  ProductBannerProps,
} from './bannerProductSection';
import { CurrentPricePollingGate } from '../../../coinData/coinCurrentPricesPolling';

const { Title } = Typography;

export function Banner(props: ProductBannerProps) {
  return (
    <>
      <CurrentPricePollingGate />

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
                  DYNAMIC STRATEGY POOLS THAT CAPITALISE ON PRICE VOLATILITY
                  WHILE STILL EARNING FEES AND YIELD
                </p>
              </motion.div>
            </Col>
            <Col span={4}></Col>
          </Row>
        </ParallaxLayer>
        <ParallaxLayer speed={0.04} factor={1}>
          <Row
            id="featured"
            justify="center"
            style={{
              paddingTop: '58vh',
              position: 'relative',
            }}
          >
            <Col md={22} lg={22} xl={20}>
              <BannerProductSection productData={props.productData} />
            </Col>
          </Row>
        </ParallaxLayer>
      </Parallax>
    </>
  );
}
