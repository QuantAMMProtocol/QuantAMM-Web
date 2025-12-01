import {
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Grid,
  Image,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { ArrowRightOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface VisionOverviewProps {
  backgroundColor?: string;
}

interface BtfType {
  typeImgSrc?: string;
  type: string;
  partnerImgSrc?: string[];
  description: string;
  benefits: [string, string][];
  examples: string;
  exampleImgSrc?: string[];
  exampleLink?: string;
}

// 4-column set (Managed BTF removed)
const BTF_TYPES: BtfType[] = [
  {
    type: 'Smart Contract Driven',
    description:
      'These BTFs have their re-weighting methodology completely on-chain in smart contracts. Tuning and parameters are fixed on creation allowing for full transparency.',
    benefits: [
      [
        'Decentralized finance (DeFi)',
        'Transparent on-chain logic, that cannot be edited post-deployment. Non custodial by design.',
      ],
      [
        'Tranparent Strategies',
        'Abolity to model, simulate and verify the strategy and its tuning parameters prior to deployment.',
      ],
      [
        'Simplicity & Security',
        'No complex off-chain infrastructure required.',
      ],
    ],
    examples: 'Ethereum, Binance Smart Chain, and Polkadot.',
  },
  {
    type: 'Chainlink CRE Managed',
    description:
      'The Chainlink Runtime environment allows you to write Go/Typescript portfolio strategies. These are run in a protected and decentralised manner on the runtime environment.',
    benefits: [
      [
        'No smart contract development',
        'Easily write and deploy BTFs using familiar programming languages like Go and TypeScript.',
      ],
      [
        'Ingest any API data source',
        'Bring in data from any API to inform your portfolio strategy.',
      ],
      [
        'Verified by Chainlink nodes',
        'Decentralized execution and verification by Chainlink nodes bring reliability and consensus.',
      ],
    ],
    examples: 'The Bitcoin Inflation tracker BTF by Truflation',
  },
  {
    type: 'EZKL Zero-Knowledge',
    description:
      'Run your existing python strategy in a verifiable way on-chain using zero-knowledge proofs. No need to convert your python to a web3 language. No alpha leak.',
    benefits: [
      [
        'Interoperable with Python',
        'Leverage existing Python libraries and codebases for your BTF strategies.',
      ],
      [
        'No alpha leakage risk',
        'Keep your proprietary strategies private while still providing verifiable proofs of execution.',
      ],
      [
        'ZK proofs for mandates & risk limits',
        'Enforce complex mandates and risk limits on-chain using zero-knowledge proofs.',
      ],
    ],
    examples: 'Coming Soon',
  },
  {
    type: 'Compliant BTF',
    description:
      'Using institutional automated compliance engines, these BTFs can enforce KYC/AML and other regulatory requirements on-chain.',
    benefits: [
      [
        'Regulatory-friendly',
        'Extend and enforce complex regional regulations on-chain.',
      ],
      ['No co-mingled funds if desired', 'Retain individual ownership of BTFs'],
      [
        'Allow-list participants',
        'Restrict participation to approved entities to ensure compliance.',
      ],
    ],
    examples: 'Coming Soon',
  },
];

// shared values
const HEADER_MIN_HEIGHT = 88; // enough room for 2-line title + icon
const DESCRIPTION_MIN_HEIGHT = 130;
const BENEFITS_MIN_HEIGHT = 96;
const WHITE_GLOVE_GRADIENT =
  'linear-gradient(135deg, #2c496b 0%, #365d8a 40%, #1b2f46 100%)';
const PARTNERSHIP_EMAIL = 'partnerships@quantamm.fi';

function BtfHeader() {
  return (
    <div>
      <Title level={2} style={{ color: 'white', marginBottom: 4 }}>
        Building the Future: BTF Types
      </Title>
      <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
        Explore the various BTF initiatives shaping tomorrow.
      </Text>
    </div>
  );
}

interface WhiteGloveCtaProps {
  variant: 'mobile' | 'desktop';
}

function WhiteGloveCta({ variant }: WhiteGloveCtaProps) {
  if (variant === 'mobile') {
    return (
      <Card
        bordered={false}
        style={{
          marginTop: 18,
          borderRadius: 20,
          background: WHITE_GLOVE_GRADIENT,
          boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
        }}
        bodyStyle={{ padding: 18 }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Text
            strong
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            White-glove partnership
          </Text>
          <Title
            level={4}
            style={{
              color: 'white',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Design and launch your next BTF with QuantAMM
          </Title>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 8,
            }}
          >
            QuantAMM offers a white-glove service for partners to use these BTF
            types. If you&apos;re interested in a specific type, contact us at{' '}
            <a
              href={`mailto:${PARTNERSHIP_EMAIL}`}
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {PARTNERSHIP_EMAIL}
            </a>
            .
          </Paragraph>
          <Button
            size="large"
            type="primary"
            icon={<ArrowRightOutlined />}
            href={`mailto:${PARTNERSHIP_EMAIL}`}
          >
            Email our team
          </Button>
        </Space>
      </Card>
    );
  }

  // desktop / tablet variant
  return (
    <Card
      bordered={false}
      style={{
        marginTop: 18, // keep it visually close to the cards
        marginBottom: 4,
        borderRadius: 24,
        background: WHITE_GLOVE_GRADIENT,
        boxShadow: '0 14px 36px rgba(0,0,0,0.5)',
      }}
      bodyStyle={{ padding: 22 }}
    >
      <Row gutter={[16, 8]} align="middle">
        <Col xs={24} md={16}>
          <Text
            strong
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            White-glove partnership
          </Text>
          <Title
            level={3}
            style={{
              color: 'white',
              marginTop: 4,
              marginBottom: 8,
            }}
          >
            Build your next BTF with QuantAMM
          </Title>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 0,
              maxWidth: 640,
            }}
          >
            QuantAMM offers a white-glove service for partners to design, launch
            and operate these BTF types. If you&apos;re interested in a specific
            type, contact us at{' '}
            <a
              href={`mailto:${PARTNERSHIP_EMAIL}`}
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {PARTNERSHIP_EMAIL}
            </a>
            .
          </Paragraph>
        </Col>
        <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 8 }}>
          <Button
            size="large"
            type="primary"
            icon={<ArrowRightOutlined />}
            href={`mailto:${PARTNERSHIP_EMAIL}`}
          >
            Email our team
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export function BtfTypes({ backgroundColor = '#2c496b' }: VisionOverviewProps) {
  const screens = useBreakpoint();

  // Mobile: accordion interaction
  if (!screens.md) {
    return (
      <Row style={{ height: '100%', width: '100%' }}>
        <Col span={24}>
          <ProductItemBackground
            wide
            layers={20}
            backgroundColourOverride={backgroundColor}
            borderColourOverride=""
          >
            <div style={{ height: '100%', padding: '16px 12px' }}>
              <BtfHeader />

              <Collapse
                accordion
                style={{ marginTop: 16, background: 'transparent' }}
                items={BTF_TYPES.map((btf, i) => ({
                  key: String(i),
                  label: (
                    <Space align="center">
                      {btf.typeImgSrc ? (
                        <Image
                          src={btf.typeImgSrc}
                          width={28}
                          height={28}
                          preview={false}
                          style={{ borderRadius: 6, objectFit: 'cover' }}
                        />
                      ) : (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      )}
                      <Text strong>{btf.type}</Text>
                    </Space>
                  ),
                  children: (
                    <Card
                      bordered
                      size="small"
                      style={{ borderRadius: 12 }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <Paragraph style={{ marginBottom: 12 }}>
                        {btf.description}
                      </Paragraph>

                      <Space wrap style={{ marginBottom: 12 }}>
                        {btf.benefits.map((b) => (
                          <Col key={b[0]} span={24}>
                            <Tooltip title={b[1]}>
                              <Tag>{b[0]}</Tag>
                            </Tooltip>
                          </Col>
                        ))}
                      </Space>
                    </Card>
                  ),
                }))}
              />

              <WhiteGloveCta variant="mobile" />
            </div>
          </ProductItemBackground>
        </Col>
      </Row>
    );
  }

  // Desktop / tablet: 4 aligned columns
  return (
    <Row style={{ height: '100%', width: '100%' }}>
      <Col span={24} style={{ height: '100%' }}>
        <ProductItemBackground
          wide
          layers={20}
          backgroundColourOverride={backgroundColor}
          borderColourOverride=""
        >
          <div
            style={{
              height: '100%',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <BtfHeader />

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  overflowY: 'auto',
                  paddingRight: 4,
                }}
              >
                <Row gutter={[16, 16]} align="stretch">
                  {BTF_TYPES.map((btf) => (
                    <Col key={btf.type} xs={24} sm={12} md={12} lg={6}>
                      <Card
                        hoverable
                        bordered={false}
                        style={{
                          borderRadius: 24,
                          height: '100%',
                        }}
                        bodyStyle={{ padding: 24, height: '100%' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                          }}
                        >
                          {/* Header (fixed min height so all titles line up) */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              marginBottom: 16,
                              minHeight: HEADER_MIN_HEIGHT,
                            }}
                          >
                            {btf.typeImgSrc ? (
                              <Image
                                src={btf.typeImgSrc}
                                width={32}
                                height={32}
                                preview={false}
                                style={{ borderRadius: 8, objectFit: 'cover' }}
                              />
                            ) : (
                              <CheckCircleTwoTone
                                twoToneColor="#52c41a"
                                style={{ fontSize: 32 }}
                              />
                            )}
                            <Title level={4} style={{ margin: 0 }}>
                              {btf.type}
                            </Title>
                          </div>

                          {/* Description */}
                          <div
                            style={{
                              minHeight: DESCRIPTION_MIN_HEIGHT,
                              marginBottom: 16,
                            }}
                          >
                            <Paragraph style={{ marginBottom: 0 }}>
                              {btf.description}
                            </Paragraph>
                          </div>

                          {/* Key benefits */}
                          <div
                            style={{
                              minHeight: BENEFITS_MIN_HEIGHT,
                              marginBottom: 16,
                            }}
                          >
                            <Text strong>Key benefits</Text>
                            <div style={{ marginTop: 8 }}>
                              {btf.benefits.map((b) => (
                                <Col
                                  key={b[0]}
                                  span={24}
                                  style={{
                                    marginLeft: '0',
                                    marginTop: '5px',
                                    padding: 0,
                                  }}
                                >
                                  <Tooltip title={b[1]}>
                                    <Tag>{b[0]}</Tag>
                                  </Tooltip>
                                </Col>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {BTF_TYPES.length === 0 && (
                  <Empty
                    description="No BTF types configured"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ marginTop: 32 }}
                  />
                )}

                <WhiteGloveCta variant="desktop" />
              </div>
            </div>
          </div>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}

export default BtfTypes;
