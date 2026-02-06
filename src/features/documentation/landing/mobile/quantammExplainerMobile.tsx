import { AgGauge } from 'ag-charts-react';
import { Col, Row, Typography } from 'antd';
import styles from './landingMobile.module.css';

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
    <div className={styles.explainerRoot}>
      <Row>
        <Col span={24} className={styles.explainerTopCol}>
          <div className={styles.explainerImageWrap}>
            <img
              src="/background/blueSand.png"
              className={styles.explainerImage}
            />
          </div>
        </Col>
        <Col span={24} className={styles.explainerTitleBlock}>
          <Title
            level={3}
            className={styles.explainerTitleIntro}
          >
            INTRODUCING
          </Title>
          <Title
            level={3}
            className={styles.explainerTitleMain}
          >
            BLOCKCHAIN TRADED FUNDS
          </Title>

          <p className={styles.explainerSubtitle}>
            FULLY ON-CHAIN ETFs THAT ADAPT TO THE VOLATILITY INHERENT WITH
            CRYPTO.
          </p>
        </Col>
        <Col span={24}>
        <div className={styles.explainerGaugeRow}>
        
                <div
                    className={styles.indexGaugeWrap}
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
                    className={styles.quantammGaugeWrap}
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
