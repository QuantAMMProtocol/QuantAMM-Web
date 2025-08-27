import { Col, Row, Tag, Typography } from 'antd';
import { ROUTES } from '../../../../routesEnum';
import { useNavigate } from 'react-router-dom';
import { sonicMacroFactsheetData } from '../../factSheets/sonicMacro/sonicMacroFactsheetData';
import { CURRENT_LIVE_FACTSHEETS } from '../../factSheets/liveFactsheets';

const { Title } = Typography;

export function BannerMobile() {
  const productData = CURRENT_LIVE_FACTSHEETS.factsheets.map((factsheet) => ({
    title: factsheet.iconTitle,
    imgSrc: factsheet.factsheetImage.image,
    description: factsheet.iconDescription,
    status: factsheet.status,
    opacity: factsheet.iconOpacity,
    imgWidth: '30%',
    focus: factsheet.iconFocus,
    route: '/factsheet/' + factsheet.poolId,
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
    route: '/factsheet/' + ROUTES.SONICMACROFACTSHEET,
  });

  const navigate = useNavigate();

  const handleNavigation = (route: string | undefined) => {
    if (route) {
      navigate(route);
    }
  };
  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: 'url(./background/Hourglass_Dune_80.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        color: 'white',
        width: '100%',
      }}
    >
      <div>
        <Title level={4} style={{ textAlign: 'center', margin: 0, padding: 0 }}>
          MOVE BEYOND LIQUIDITY PROVIDING
        </Title>
        <p
          style={{
            textAlign: 'center',
            fontSize: '7px',
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          DYNAMIC STRATEGY POOLS THAT CAPITALISE ON PRICE VOLATILITY WHILE STILL
          EARNING FEES AND YIELD
        </p>
      </div>
      <div style={{ marginTop: '38vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '5px 0',
          }}
        >
          {productData.map((product, index) => (
            <Tag
              key={index}
              onClick={() => handleNavigation(product.route)}
              style={{
                width: '100%',
                margin: '5px',
                textAlign: 'center',
                opacity: product.opacity,
              }}
            >
              <Row style={{ margin: 0, padding: 0 }}>
                <Col span={24}>
                  <div
                    style={{
                      height: '10%',
                    }}
                  >
                    <img
                      src={product.imgSrc}
                      style={{ width: '10%', height: 'auto', marginTop: '5px' }}
                    />
                  </div>
                </Col>
                <Col span={24}>
                  <h5 style={{ margin: 0 }}>
                    {product.title + ' (' + product.status + ')'}
                  </h5>
                  <p
                    style={{
                      margin: '5px',
                      paddingLeft: '5px',
                      paddingRight: '5px',
                      textAlign: 'center',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {product.description.join('\n')}
                  </p>
                </Col>
              </Row>
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
