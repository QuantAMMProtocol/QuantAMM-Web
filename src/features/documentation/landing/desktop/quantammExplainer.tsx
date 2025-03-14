import { Button, Col, Row, Steps, Timeline, Typography } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { WeightChangeOverTimeGraph } from '../../../shared/graphs/weightChangeOverTime';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { useEffect, useState } from 'react';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { ROUTES } from '../../../../routesEnum';
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ProductItemOverviewGraph } from '../../../shared';
import { AgGauge } from 'ag-charts-react';
import { Cross, HeartIcon } from 'lucide-react';
import './quantammExplainer.css';

const { Title } = Typography;

export function QuantAmmExplainer() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const performanceStages = [
    'Themed Baskets',
    'Liquid basket tokens',
    'Able to earn yield',
    'Safe on-chain re-balancing',
    'No Streaming Fees for LPs',
    'Adaptive On-Chain Strategies',
    'Daily Market Responsiveness',
  ];
  // Effect to load breakdowns whenever the tab key changes
  useEffect(() => {
    // Function to load breakdowns based on the selected tab
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<SimulationRunBreakdown[]> => {
      setLoading(true); // Start loading
      const fetchedBreakdowns = await Promise.all(
        poolNames.map((poolName) => getBreakdown(poolName))
      );
      setBreakdowns(fetchedBreakdowns);
      return fetchedBreakdowns;
    };

    const loadData = async (): Promise<SimulationRunBreakdown[]> => {
      // Load breakdowns for the selected tab
      return await loadBreakdowns([
        'balancerWeighted',
        'quantAMMAntiMomentum',
      ] as Pool[]); // Awaiting the asynchronous function here
    };
    if (loading) {
      loadData()
        .then((fetchedBreakdowns) => {
          setBreakdowns(fetchedBreakdowns);
        })
        .catch((error) => {
          console.error('Failed to load breakdowns:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setBreakdowns, setLoading, breakdowns, loading]);

  return (
    <ProductItemBackground
      wide={true}
      layers={20}
      backgroundColourOverride="#FFFEF2"
      borderColourOverride="#f6f4ef"
    >
      
      <Row style={{ marginTop: '15vh' }}>
        <Col span={5}></Col>
        <Col span={2} style={{ height: '60vh', paddingTop: '10px' }}>
          <div style={{ height: '100%' }} id="indexGauge">
            <AgGauge
              options={{
                type: 'linear-gauge',
                container: document.getElementById('indexGauge'),
                value: 3.8,

                scale: {
                  min: 0,
                  max: 8,
                  label: {
                    placement: 'before',
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
                width: 500,
              }}
            />
          </div>
        </Col>
        <Col
          span={10}
          style={{ padding: 0, height: '30vh', marginTop: '10px' }}
        >
          <Row>
            <Col span={24} style={{marginBottom:'2vh'}}>
              
            <Title
                style={{
                  color: '#162536',
                  textAlign: 'center',
                  margin: 0,
                  padding:0,
                  fontWeight: '400',
                }}
              >
                INTRODUCING
              </Title>
              <Title
                style={{
                  color: '#162536',
                  textAlign: 'center',
                  margin: 0,
                  padding:0
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
                Fully on-chain ETFs that adapt to the volatility inherent with
                crypto.
              </p>
            </Col>
            <Col
              span={8}
              style={{
                height: '100%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
                <div>
                <Timeline
                  style={{ backgroundColor: 'transparent' }}
                  mode="left"
                  items={[
                  {
                    className: 'quantamm_error_step',
                    label: '',
                    children:
                    'FACT: Crypto markets are volatile. Index products are slow to react',
                    color: 'red',
                    dot: (
                    <CloseCircleOutlined className="quantamm_error_step" />
                    ),
                  },
                  {
                    className: 'quantamm_error_step',
                    children:
                    'FACT: Market Caps are correlated in crypto. Index products are not diversified',
                    color: 'red',
                    dot: (
                    <CloseCircleOutlined className="timeline-clock-icon" />
                    ),
                  },
                  {
                    className: 'quantamm_error_step',
                    children:
                    'FACT: Crypto Index products charge fees as high as 1980s hedge funds',
                    color: 'red',
                    dot: (
                    <CloseCircleOutlined className="timeline-clock-icon" />
                    ),
                  },
                  ]}
                />
                </div>
            </Col>
            <Col span={8} style={{ height: '100%', padding: 0 }}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/background/blueSand.png"
                  style={{ maxWidth: '100%', maxHeight: '100%', marginTop:'1vh' }}
                />
              </div>
            </Col>
            <Col
              span={8}
              style={{
                height: '100%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div>
                <Timeline
                  style={{ backgroundColor: 'transparent' }}
                  mode="right"
                  items={[
                    {
                      className: 'quantamm_success_step',
                      label: '',
                      children:
                        'SOLUTION: Assess the market daily and adjust the BTF weights and holdings',
                      color: 'green',
                      dot: (
                        <CheckCircleOutlined className="quantamm_success_step" />
                      ),
                    },
                    {
                      className: 'quantamm_success_step',
                      children:
                        'SOLUTION: Apply on-chain portfolio strategies to capitalise on prices',
                      color: 'green',
                      dot: (
                        <CheckCircleOutlined className="timeline-clock-icon" />
                      ),
                    },
                    {
                      className: 'quantamm_success_step',
                      children:
                        'SOLUTION: No streaming fees for LPs! We take our maintenance fees elsewhere',
                      color: 'green',
                      dot: (
                        <CheckCircleOutlined className="timeline-clock-icon" />
                      ),
                    },
                  ]}
                />
              </div>
            </Col>
            <Col span={24}>
              {' '}
              <p
                style={{
                  color: '#162536',
                  textAlign: 'center',
                  marginTop: '0px',
                }}
              >
                DON&apos;T BE A INDEX. REACT TO FAST MARKETS. BE A BTF.
              </p>
            </Col>
          </Row>
        </Col>
        <Col span={3} style={{ height: '30vh', paddingTop: '10px' }}>
          <div style={{ height: '100%' }} id="quantammGauge">
            <AgGauge
              options={{
                type: 'linear-gauge',
                container: document.getElementById('quantammGauge'),
                value: 8,

                scale: {
                  min: 0,
                  max: 8,
                  label: {
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
                width: 500,
              }}
            />
          </div>
        </Col>
        <Col span={4} style={{ paddingTop: '10px' }}></Col>
      </Row><Row style={{ height: '10px', margin: 0, padding: 0 }}>
        <Col span={3}></Col>
        <Col
          span={4}
          style={{ textAlign: 'center', paddingLeft: '80px', color: '#162536' }}
        >
          CURRENT INDEX PRODUCTS
        </Col>
        <Col span={10} style={{ padding: '5vh' }}></Col>
        <Col
          span={3}
          style={{
            paddingRight: '20px',
            marginRight: '10vw',
            textAlign: 'center',
            color: '#162536',
          }}
        >
          QUANTAMM BTF
        </Col>
        <Col span={4}></Col>
      </Row>
    </ProductItemBackground>
  );
}
