import { Col, Row } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { Steps } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import styles from './landingDesktop.module.css';

interface VisionOverviewProps {
  backgroundColor?: string;
}

export function VisionOverview({
  backgroundColor = '#2c496b',
}: VisionOverviewProps) {
  return (
    <Row className={styles.fullHeight}>
      <Col span={24}>
        <ProductItemBackground
          wide
          layers={20}
          backgroundColourOverride={backgroundColor}
          borderColourOverride=""
        >
          <Row className={styles.visionSpacer}>
            <Col span={4}></Col>
            <Col span={16}>
              <div className={styles.visionHeader}>
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
          <Row className={styles.visionSpacer}>
            <Col span={4}></Col>
            <Col span={16}>
              <Steps
                className={styles.visionSteps}
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
                    title: '15th May 2025',
                    description: 'QuantAMM launches 1st BTF',
                    icon: <CheckCircleOutlined />,
                    status: 'process',
                  },
                ]}
              />
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row
            className={styles.logoRow}
          >
            <Col span={4}></Col>
            <Col span={1}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '90%' }}
                src="/companies/8vc.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/369.png"
              />
            </Col>
            <Col span={2}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/BalancerV3.png"
              />
            </Col>
            <Col span={2}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/chainlink_build.png"
              />
            </Col>
            <Col span={1} style={{ marginLeft: '10px' }}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '70%' }}
                src="/companies/Mako.png"
              />
            </Col>
            <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '80%' }}
                src="/companies/longhashx.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/Marshland.png"
              />
            </Col>
            <Col span={2}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/Codehawks.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/Cyfrin.png"
              />
            </Col>
            <Col span={1}>
              <img
                loading="lazy"
                className={styles.logoImage}
                style={{ width: '100%' }}
                src="/companies/Hypernest.png"
              />
            </Col>
            <Col span={4}></Col>
          </Row>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}
