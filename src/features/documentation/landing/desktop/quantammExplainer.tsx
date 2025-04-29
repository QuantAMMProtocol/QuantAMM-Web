import { Col, Row, Typography } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { AgGauge } from 'ag-charts-react';
import './quantammExplainer.css';

const { Title } = Typography;

export function QuantAmmExplainer() {
  const performanceStages = [
    'Themed Baskets',
    'Liquid basket tokens',
    'Able to earn yield',
    'Safe on-chain re-balancing',
    'No Maintenance Fees for LPs',
    'Adaptive On-Chain Strategies',
    'Daily Market Responsiveness',
  ];

  const RED = '#f5222d';
  const GREEN = '#237804';
  const LINE = '#d9d9d9';

  const stepData = [
    [
      {
        title: 'FACT',
        description: 'Crypto markets are volatile',
        icon: <DownCircleOutlined style={{ color: RED, fontSize: 30 }} />,
        color: RED,
      },
      {
        title: 'SOLUTION',
        description: 'Assess the market daily and react',
        icon: <UpCircleOutlined style={{ color: GREEN, fontSize: 30 }} />,
        color: GREEN,
      },
    ],
    [
      {
        title: 'FACT',
        description: 'Market Caps are correlated in crypto',
        icon: <DownCircleOutlined style={{ color: RED, fontSize: 30 }} />,
        color: RED,
      },
      {
        title: 'SOLUTION',
        description: 'Apply non market cap portfolio strategies',
        icon: <UpCircleOutlined style={{ color: GREEN, fontSize: 30 }} />,
        color: GREEN,
      },
    ],
    [
      {
        title: 'FACT',
        description: 'Crypto Indexs charge hedge fund level fees',
        icon: <DownCircleOutlined style={{ color: RED, fontSize: 30 }} />,
        color: RED,
      },
      {
        title: 'SOLUTION',
        description: 'No maintenance fees charged to LPs',
        icon: <UpCircleOutlined style={{ color: GREEN, fontSize: 30 }} />,
        color: GREEN,
      },
    ],
  ];

  return (
    <ProductItemBackground
      wide={true}
      layers={20}
      backgroundColourOverride="#FFFEF2"
      borderColourOverride="#f6f4ef"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Row>
          <Col span={2}></Col>

          <Col
            span={12}
            style={{ padding: 0, height: '30vh', marginTop: '10px' }}
          >
            <Row>
              <Col span={24} style={{ padding: 0 }}>
                <div
                  style={{
                    height: '10vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/background/blueSand.png"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      marginTop: '1vh',
                    }}
                  />
                </div>
              </Col>
              <Col
                span={24}
                style={{ marginBottom: '0.5vh', marginLeft: 0, marginRight: 0 }}
              >
                <Title
                  level={2}
                  style={{
                    color: '#162536',
                    textAlign: 'center',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  INTRODUCING
                </Title>
                <Title
                  level={2}
                  style={{
                    color: '#162536',
                    textAlign: 'center',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  BLOCKCHAIN TRADED FUNDS
                </Title>

                <p
                  style={{
                    color: '#162536',
                    textAlign: 'center',
                    marginTop: '0px',
                  }}
                >
                  FULLY ON-CHAIN ETFs THAT ADAPT TO THE VOLATILITY INHERENT WITH
                  CRYPTO.
                </p>
              </Col>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                <div style={{ width: '100%', marginLeft: 25 }}>
                  {stepData.map((pair, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center', // line & icons centered
                        marginBottom: idx < stepData.length - 1 ? 40 : 0,
                      }}
                    >
                      {/* LEFT (FACT) fixed width */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: 170,
                        }}
                      >
                        {pair[0].icon}
                        <div
                          style={{
                            marginLeft: 8,
                            color: pair[0].color,
                            fontSize: 14,
                            lineHeight: 1.5,
                            maxWidth: 170,
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 600 }}>
                            {pair[0].title}
                          </p>
                          <p style={{ margin: '4px 0 0' }}>
                            {pair[0].description}
                          </p>
                        </div>
                      </div>

                      {/* full-width line */}
                      <div
                        style={{
                          flexGrow: 1,
                          height: 1,
                          backgroundColor: LINE,
                          margin: '0 16px',
                        }}
                      />

                      {/* RIGHT (SOLUTION) fixed width */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: 170,
                        }}
                      >
                        <div
                          style={{
                            textAlign: 'right',
                            marginRight: 8,
                            color: pair[1].color,
                            fontSize: 14,
                            lineHeight: 1.5,
                            maxWidth: 170,
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 600 }}>
                            {pair[1].title}
                          </p>
                          <p style={{ margin: '4px 0 0' }}>
                            {pair[1].description}
                          </p>
                        </div>
                        {pair[1].icon}
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
              <Col span={24}>
                {' '}
                <p
                  style={{
                    color: '#162536',
                    textAlign: 'center',
                    marginTop: '20px',
                  }}
                >
                  DON&apos;T BE A INDEX. REACT TO FAST MARKETS. BE A BTF.
                </p>
              </Col>
            </Row>
          </Col>
          <Col span={3}></Col>
          <Col span={3} style={{ paddingTop: '15px' }}>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
                id="indexGauge"
              >
                <AgGauge
                  options={{
                    type: 'linear-gauge',
                    container: document.getElementById('indexGauge'),
                    value: 3.8,
                    subtitle: {
                      text: 'INDEX',
                      fontFamily: 'Jost',
                      fontSize: 16,
                      color: '#162536',
                    },
                    scale: {
                      min: 0,
                      max: 8,
                      label: {
                        fontFamily: 'Jost',
                        placement: 'before',
                        color: '#162536',
                        formatter: () => {
                          return ``;
                        },
                      },
                      interval: {
                        values: [1, 2, 3, 4, 5, 6, 7],
                      },
                    },
                    bar: {
                      fillMode: 'continuous',
                      fills: [
                        { color: 'rgba(166, 0, 0, 0.6)', stop: 1 },
                        { color: 'rgba(220, 109, 6, 0.6)', stop: 2 },
                        { color: 'rgba(240, 228, 6, 0.6)', stop: 3 },
                        { color: 'rgba(74, 189, 2, 0.6)', stop: 4 },
                        { color: 'rgba(2, 189, 46, 0.6)', stop: 5 },
                      ],
                    },

                    segmentation: {
                      enabled: true,
                      interval: {
                        values: [1, 2, 3, 4, 5, 6, 7],
                      },
                      spacing: 2,
                    },
                    cornerMode: 'container',
                    cornerRadius: 99,
                    background: {
                      visible: false,
                      fill: 'transparent',
                    },
                    padding: {
                      left: 0,
                      top: 5,
                      bottom: 5,
                    },
                    height: 500,
                    width: 100,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginLeft: '-170px',
                }}
                id="quantammGauge"
              >
                <AgGauge
                  options={{
                    type: 'linear-gauge',
                    container: document.getElementById('quantammGauge'),
                    value: 8,
                    subtitle: {
                      text: 'BTF',
                      fontFamily: 'Jost',
                      fontSize: 16,
                      color: '#162536',
                    },
                    scale: {
                      min: 0,
                      max: 8,
                      label: {
                        fontFamily: 'Jost',
                        placement: 'after',
                        color: '#162536',
                        formatter: ({ index }) => {
                          return `${performanceStages[index]}`;
                        },
                      },
                      interval: {
                        values: [1, 2, 3, 4, 5, 6, 7],
                      },
                    },
                    bar: {
                      fillMode: 'continuous',
                      fills: [
                        { color: 'rgba(166, 0, 0, 0.6)', stop: 1 },
                        { color: 'rgba(220, 109, 6, 0.6)', stop: 2 },
                        { color: 'rgba(240, 228, 6, 0.6)', stop: 3 },
                        { color: 'rgba(74, 189, 2, 0.6)', stop: 4 },
                        { color: 'rgba(2, 189, 46, 0.6)', stop: 5 },
                      ],
                    },

                    segmentation: {
                      enabled: true,
                      interval: {
                        values: [1, 2, 3, 4, 5, 6, 7],
                      },
                      spacing: 2,
                    },
                    cornerMode: 'container',
                    cornerRadius: 99,
                    background: {
                      visible: false,
                      fill: 'transparent',
                    },
                    padding: {
                      left: 0,
                      top: 5,
                      bottom: 5,
                    },
                    height: 500,
                    width: 400,
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </ProductItemBackground>
  );
}
