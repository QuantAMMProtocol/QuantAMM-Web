import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { Col, Row } from 'antd';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../../routesEnum';
import { sonicMacroFactsheetData } from '../../factSheets/sonicMacro/sonicMacroFactsheetData';
import { BannerProductSection } from './bannerProductSection';
import { CURRENT_LIVE_FACTSHEETS } from '../../factSheets/liveFactsheets';

const { Title } = Typography;

export function Banner() {
  const productData = CURRENT_LIVE_FACTSHEETS.factsheets.map((factsheet) => ({
    title: factsheet.iconTitle,
    imgSrc: factsheet.factsheetImage.image,
    description: factsheet.iconDescription,
    status: factsheet.status,
    opacity: factsheet.iconOpacity,
    imgWidth: '30%',
    focus: factsheet.iconFocus,
    factsheetRoute: '/factsheet/' + ROUTES.SONICMACROFACTSHEET,
    productExplorerRoute: ROUTES.PRODUCT_EXPLORER + '/' + factsheet.poolChain.toUpperCase() + '/' + ROUTES.SONICMACROFACTSHEET,
  }));

  //stub
  productData.push({
    title: 'TradFi',
    imgSrc: sonicMacroFactsheetData.factsheetImage.image,
    description: ['The sonic ecosystem basket', 'Mega Caps with Yield Focus'],
    status: 'LIVE',
    opacity: 1,
    imgWidth: '30%',
    focus: true,
    factsheetRoute: '/factsheet/' + ROUTES.SONICMACROFACTSHEET,
    productExplorerRoute: ROUTES.PRODUCT_EXPLORER + '/MAINNET/'+ ROUTES.SONICMACROFACTSHEET,
  });

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
          id="featured"
          justify="center"
          style={{
            paddingTop: '58vh',
            position: 'relative',
          }}
        >
          <Col md={22} lg={22} xl={20}>
            <BannerProductSection productData={productData} />
          </Col>
        </Row>
      </ParallaxLayer>
    </Parallax>
  );
}
