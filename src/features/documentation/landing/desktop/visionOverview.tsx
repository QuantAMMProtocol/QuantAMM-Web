import { Col, Row } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { Steps } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

interface VisionOverviewProps {
  backgroundColor?: string;
}

export function VisionOverview({
  backgroundColor = '#2c496b',
}: VisionOverviewProps) {
  return (
    <Row style={{ height: '100%' }}>
      <Col span={24}>
        <ProductItemBackground
          wide
          layers={20}
          backgroundColourOverride={backgroundColor}
          borderColourOverride=""
        >
          <Row>
            <Col span={4}></Col>
            <Col span={16}>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h1 style={{ marginBottom: '5px' }}>OUR VISION</h1>
                <p style={{ marginBottom: 0 }}>
                  At QuantAMM, our vision is to build a passive fund product
                  that everyone can understand and everyone can access. There
                  has been decades of TradFi passive product innovations. While
                  ETFs with BTC/ETH are coming, we go one step further and bring
                  generic fund construction infrastructure on chain:
                </p>
                <p style={{ marginBottom: 0 }}>
                  Real World Savings for investors and institutions by running
                  funds on-chain
                </p>
                <p style={{ marginBottom: 0 }}>
                  Our belief and all our research shows that all of the above
                  can only be achieved with a new form of passive AMM:
                </p>
              </div>
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={16}>
              <Steps
                style={{ marginTop: '5vh' }}
                current={4}
                items={[
                  {
                    title: 'H1 2023',
                    description: 'Simulator Build',
                    icon: <CheckCircleOutlined />,
                    status: 'process',
                  },
                  {
                    title: 'H2 2023',
                    description: 'Protocol Build and ToB in progress audit',
                    icon: <CheckCircleOutlined />,
                    status: 'process',
                  },
                  {
                    title: 'H1 2024',
                    description: 'Balancer V3 Build Conversion',
                    icon: <CheckCircleOutlined />,
                    status: 'process',
                  },
                  {
                    title: 'H2 2024',
                    description: 'Cyfrin/Codehawks audits awaiting V3 launch',
                    icon: <CheckCircleOutlined />,
                    status: 'process',
                  },
                  {
                    title: 'April 2025',
                    description: 'QuantAMM Launches BTF',
                    icon: <LoadingOutlined />,
                    status: 'process',
                  },
                ]}
              />
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5vh',
            }}
          >
            <Col span={4}></Col>
            <Col span={1}>
              <img
                loading="lazy"
                style={{
                  width: '90%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
                src="/companies/8vc.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
                src="/companies/369.png"
              />
            </Col>
            <Col span={2}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '5 auto',
                }}
                src="/companies/BalancerV3.png"
              />
            </Col>
            <Col span={2}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '5 auto',
                }}
                src="/companies/chainlink_build.png"
              />
            </Col>
            <Col span={1} style={{ marginLeft: '10px' }}>
              <img
                loading="lazy"
                style={{
                  width: '70%',
                  height: 'auto',
                  display: 'block',
                  margin: '5 auto',
                }}
                src="/companies/Mako.png"
              />
            </Col>
            <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                loading="lazy"
                style={{
                  width: '80%',
                  height: 'auto',
                  display: 'block',
                  margin: '5 auto',
                }}
                src="/companies/longhashx.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '5 auto',
                }}
                src="/companies/Marshland.png"
              />
            </Col>
            <Col span={2}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '5 auto',
                  justifyContent: 'center',
                }}
                src="/companies/Codehawks.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '10 auto',
                }}
                src="/companies/Cyfrin.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '20 auto',
                }}
                src="/companies/Hypernest.png"
              />
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row>
            <Col span={24}>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h1>Meet the Founders</h1>
              </div>
            </Col>
            <Col span={4}></Col>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h3>Matthew Willetts</h3>
                <p>Founder & CEO</p>
                <h5 style={{ margin: 0 }}>Previous experience:</h5>
                <p style={{ margin: 0 }}>CS Research Fellow @ UCL</p>
                <p style={{ margin: 0 }}>
                  PhD in statistics & machine learning @ Oxford
                </p>
                <p style={{ margin: 0 }}>
                  AI consultant: clients including IDEO and Ford
                </p>
                <p style={{ margin: 0 }}>
                  Catastrophe modelling @ Risk Management Solutions
                </p>
                <p style={{ margin: 0 }}>BA Natural Sciences @ Cambridge</p>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h3>Christian Harrington</h3>
                <p>Founder & CTO</p>
                <h5 style={{ margin: 0 }}>Previous experience:</h5>
                <p style={{ margin: 0 }}>
                  Central OMS technical architect @ Man Group
                </p>
                <p style={{ margin: 0 }}>
                  Ops and compliance tech project lead @ Man Group
                </p>
                <p style={{ margin: 0 }}>
                  Full stack engineering on LME, LSE, ICE systems
                </p>
                <p style={{ margin: 0 }}>
                  Low latency data feed engineering in C++
                </p>
                <p style={{ margin: 0 }}>BA Natural Sciences @ Cambridge</p>
              </div>
            </Col>
            <Col span={4}></Col>
          </Row>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}
