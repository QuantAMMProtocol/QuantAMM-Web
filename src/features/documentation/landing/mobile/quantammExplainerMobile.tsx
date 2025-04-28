import { AgGauge } from 'ag-charts-react';
import { Col, Row, Typography } from 'antd';

const { Title } = Typography;

export function QuantAMMExplainerMobile() {

  const performanceStages = [
    'Themed Baskets',
    'Liquid basket tokens',
    'Able to earn yield',
    'Safe on-chain re-balancing',
    'No Maintenance Fees for LPs',
    'Adaptive On-Chain Strategies',
    'Daily Market Responsiveness',
  ];
  
  return (
    <div style={{height: '100vh', backgroundColor: '#FFFEF2'}}>
      <Row>
        <Col span={24} style={{ padding: 0, marginTop:'2vh' }}>
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
        <Col span={24} style={{ marginBottom: '0.5vh' }}>
          <Title
            level={3}
            style={{
              color: '#162536',
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '0px',
              padding: 0,
              fontWeight: '400',
            }}
          >
            INTRODUCING
          </Title>
          <Title
            level={3}
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
        <Col span={24}>
        <div style={{display:'flex'}}>
        
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
                        height: 450,
                        width: 100,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection:'row',
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
                        height: 450,
                        width: 400,
                      }}
                    />
                  </div>
                </div>
        </Col>
      </Row>
    </div>
  );
}
