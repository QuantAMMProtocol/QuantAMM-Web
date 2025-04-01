import { Button, Card, Col, Row, Tag, Typography } from "antd";

const { Title } = Typography;

export function BannerMobile(){
    return <div
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
      <Title
        level={4}
        style={{ textAlign: 'center', margin: 0, padding: 0 }}
      >
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
        CAPITALIZE ON UNDERLYING PRICE MOVEMENTS WHILE STILL EARNING FEES
        AND YIELD
      </p>
    </div>
    <div style={{ marginTop: '40vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '5px 0',
          }}
        >
          <Tag
                style={{ width: '100%', margin: '5px', textAlign: 'center' }}
              >
                <Row style={{ margin: 0, padding: 0 }}>
                  <Col span={24}>
                    <div
                      style={{
                        height: '10%',
                      }}
                    >
                      <img
                        src="/assets/safe_haven_BTF_icon_mono.png"
                        style={{ width: '10%', height: 'auto', marginTop:'5px' }}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <h5 style={{ margin: 0 }}>The Safe Haven</h5>
                    <p
                      style={{
                        margin: '5px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      Follow trends of BTC, Gold and T-Bills.
                    </p>
                  </Col>
                </Row>
              </Tag>

              <Tag
                style={{ width: '100%', margin: '5px', textAlign: 'center' }}
              >
                <Row style={{ margin: 0, padding: 0 }}>
                  <Col span={24}>
                    <div
                      style={{
                        height: '10%'
                      }}
                    >
                      <img
                        src="/assets/RWA_mono.png"
                        style={{ width: '10%', height: 'auto', marginTop:'5px' }}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <h5 style={{ margin: 0 }}>The RWA Agnostic</h5>
                    <p
                      style={{
                        margin: '5px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      Get RWA exposure by tracking RWA issuers.
                    </p>
                  </Col>
                </Row>
              </Tag>
              <Tag
                style={{ width: '100%', margin: '5px', textAlign: 'center' }}
              >
                <Row style={{ margin: 0, padding: 0 }}>
                  <Col span={24}>
                    <div
                      style={{
                        height: '10%',
                      }}
                    >
                      <img
                        src="/assets/sonic_BTF_icon.png"
                        style={{ width: '10%', height: 'auto', marginTop:'5px' }}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <h5 style={{ margin: 0, textAlign: 'center' }}>
                        Super Sonic Momentum
                      </h5>
                      <p
                        style={{
                          margin: 0,
                          textAlign: 'center',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        Combining Sonic yield and trend following
                      </p>
                    </div>
                  </Col>
                </Row>
              </Tag>
        </div>
    </div>
  </div>
}