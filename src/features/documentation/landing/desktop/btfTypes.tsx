// btfTypes.tsx
import React from 'react';
import {
  Button,
  Card,
  Col,
  Grid,
  Image,
  Layout,
  List,
  Row,
  Space,
  Tag,
  Typography,
  Collapse,
  Empty,
} from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';

const { Title, Text, Paragraph } = Typography;
const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface VisionOverviewProps {
  backgroundColor?: string;
}

interface BtfType {
  typeImgSrc?: string;
  type: string;
  partnerImgSrc?: string[];
  description: string;
  benefits: string; // comma- or period-separated; rendered as tags
  examples: string;
  exampleImgSrc?: string[];
  exampleLink?: string;
}

// NOTE: Data preserved from your original component.
const BTF_TYPES: BtfType[] = [
  {
    type: 'Smart Contract BTF',
    description:
      'These BTFs are implemented through smart contracts on blockchain platforms, enabling decentralized and automated execution of agreements.',
    benefits:
      'Decentralized finance (DeFi), Supply chain management, Digital identity verification',
    examples: 'Ethereum, Binance Smart Chain, and Polkadot.',
  },
  {
    type: 'Chainlink CRE Managed BTF',
    description:
      'Write Go/Typescript portfolio strategies run and verified by Chainlink.',
    benefits:
      'No smart contract development, Ingest any API data source, Verified by Chainlink nodes',
    examples: 'The Bitcoin Inflation tracker BTF by Truflation',
  },
  {
    type: 'EZKL Zero-Knowledge BTF',
    description:
      'Run your existing python strategy in a verifiable way on-chain using zero-knowledge proofs.',
    benefits:
      'Interoperable with Python, No alpha leakage risk, ZK proofs for mandates & risk limits',
    examples: 'Coming Soon',
  },
  {
    type: 'Managed BTF',
    description:
      'Simply update the weights according to your views. Vault-like BTFs.',
    benefits:
      'Simple API for updates, No smart contract development, Fits model-portfolio workflows',
    examples: 'Coming Soon',
  },
  {
    type: 'Gated BTF',
    description:
      'BTFs can be gated either at deposit or at swap to participants you approve.',
    benefits:
      'Regulatory-friendly, No co-mingled funds if desired, Allow-list participants',
    examples: 'Coming Soon',
  },
];

/**
 * Split benefit text into nice small tags.
 */
const toBenefitTags = (benefits: string): string[] =>
  benefits
    .split(/[.,]/)
    .map((s) => s.trim())
    .filter(Boolean);

export function BtfTypes({ backgroundColor = '#2c496b' }: VisionOverviewProps) {
  const screens = useBreakpoint();
  const [activeIndex, setActiveIndex] = React.useState(0);

  // For mobile: render an accordion version of every card
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
              <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
                Building the Future: BTF Types
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Explore the different BTF types and see what each one offers.
              </Text>

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
                        {toBenefitTags(btf.benefits).map((b) => (
                          <Tag key={b}>{b}</Tag>
                        ))}
                      </Space>

                      {btf.partnerImgSrc?.length ? (
                        <Space wrap style={{ marginBottom: 12 }}>
                          {btf.partnerImgSrc.map((src, idx) => (
                            <Image
                              key={idx}
                              src={src}
                              width={24}
                              height={24}
                              preview={false}
                              style={{ objectFit: 'contain' }}
                            />
                          ))}
                        </Space>
                      ) : null}

                      <Space align="center" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ flex: 1 }}>
                          {btf.examples || 'No examples yet'}
                        </Text>
                        <Button
                          type="primary"
                          size="small"
                          href={btf.exampleLink}
                          target={btf.exampleLink ? '_blank' : undefined}
                          rel={btf.exampleLink ? 'noopener noreferrer' : undefined}
                          disabled={!btf.exampleLink}
                          icon={<ArrowRightOutlined />}
                        >
                          View
                        </Button>
                      </Space>
                    </Card>
                  ),
                }))}
              />
            </div>
          </ProductItemBackground>
        </Col>
      </Row>
    );
  }

  // Desktop/tablet layout: left list + right detail
  const selected = BTF_TYPES[activeIndex];

  return (
    <Row style={{ height: '100%', width: '100%' }}>
      <Col span={24} style={{ height: '100%' }}>
        <ProductItemBackground
          wide
          layers={20}
          backgroundColourOverride={backgroundColor}
          borderColourOverride=""
        >
          <Layout
            style={{
              height: '100%',
              background: 'transparent',
              overflow: 'hidden',
            }}
          >
            <Sider
              width={300}
              style={{
                background: 'transparent',
                padding: 16,
                borderRight: '1px solid rgba(255,255,255,0.12)',
                overflow: 'hidden',
              }}
            >
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                BTF Types
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Pick one to learn more
              </Text>

              <div
                style={{
                  marginTop: 12,
                  height: 'calc(100% - 56px)',
                  overflowY: 'auto',
                  paddingRight: 4,
                }}
              >
                <List
                  dataSource={BTF_TYPES}
                  split={false}
                  renderItem={(btf, index) => (
                    <List.Item
                      onClick={() => setActiveIndex(index)}
                      style={{
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: 12,
                      }}
                    >
                      <Card
                        hoverable
                        onClick={() => setActiveIndex(index)}
                        bodyStyle={{ padding: 12 }}
                        style={{
                          width: '100%',
                          borderRadius: 12,
                          border:
                            index === activeIndex
                              ? '1px solid #1677ff'
                              : undefined,
                          boxShadow:
                            index === activeIndex
                              ? '0 0 0 2px rgba(22,119,255,0.15)'
                              : undefined,
                        }}
                      >
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
                          <div>
                            <Text strong>{btf.type}</Text>
                            <div style={{ lineHeight: 1 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {toBenefitTags(btf.benefits)[0] || 'Learn more'}
                              </Text>
                            </div>
                          </div>
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </Sider>

            <Content
              style={{
                padding: 16,
                overflow: 'hidden',
              }}
            >
              <Row style={{ height: '100%' }} gutter={[16, 16]}>
                <Col span={24} style={{ height: 72 }}>
                  <Title level={2} style={{ color: 'white', margin: 0 }}>
                    Building the Future: BTF Types
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Explore the various BTF initiatives shaping tomorrow.
                  </Text>
                </Col>

                <Col span={24} style={{ height: 'calc(100% - 72px)' }}>
                  <div
                    style={{
                      height: '100%',
                      overflowY: 'auto',
                      paddingRight: 4,
                    }}
                  >
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 16,
                      }}
                      bodyStyle={{ padding: 20 }}
                    >
                      <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <Space align="center" size={16}>
                          {selected?.typeImgSrc ? (
                            <Image
                              src={selected.typeImgSrc}
                              width={40}
                              height={40}
                              preview={false}
                              style={{ borderRadius: 8, objectFit: 'cover' }}
                            />
                          ) : (
                            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 32 }} />
                          )}
                          <Title level={3} style={{ margin: 0 }}>
                            {selected?.type ?? '—'}
                          </Title>
                        </Space>

                        {selected ? (
                          <>
                            <Paragraph style={{ marginBottom: 0 }}>
                              {selected.description}
                            </Paragraph>

                            <div>
                              <Text strong>Key benefits</Text>
                              <div style={{ marginTop: 8 }}>
                                <Space wrap>
                                  {toBenefitTags(selected.benefits).map((b) => (
                                    <Tag key={b}>{b}</Tag>
                                  ))}
                                </Space>
                              </div>
                            </div>

                            {selected.partnerImgSrc?.length ? (
                              <div>
                                <Text strong>Partners</Text>
                                <div style={{ marginTop: 8 }}>
                                  <Space wrap>
                                    {selected.partnerImgSrc.map((src, i) => (
                                      <Image
                                        key={`partner-${i}`}
                                        src={src}
                                        width={28}
                                        height={28}
                                        preview={false}
                                        style={{ objectFit: 'contain' }}
                                      />
                                    ))}
                                  </Space>
                                </div>
                              </div>
                            ) : null}

                            <Row align="middle" gutter={[12, 12]}>
                              <Col flex="auto">
                                <Text type="secondary">
                                  {selected.examples || 'No examples yet'}
                                </Text>
                              </Col>
                              <Col>
                                <Button
                                  type="primary"
                                  icon={<ArrowRightOutlined />}
                                  href={selected.exampleLink}
                                  target={selected.exampleLink ? '_blank' : undefined}
                                  rel={
                                    selected.exampleLink
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  disabled={!selected.exampleLink}
                                >
                                  View example
                                </Button>
                              </Col>
                              {selected.exampleImgSrc?.length ? (
                                <Col span={24}>
                                  <Space wrap>
                                    {selected.exampleImgSrc.map((src, i) => (
                                      <Image
                                        key={`ex-${i}`}
                                        src={src}
                                        width={48}
                                        height={32}
                                        preview={false}
                                        style={{
                                          borderRadius: 6,
                                          objectFit: 'cover',
                                        }}
                                      />
                                    ))}
                                  </Space>
                                </Col>
                              ) : null}
                            </Row>
                          </>
                        ) : (
                          <Empty description="Select a BTF type to view details" />
                        )}
                      </Space>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Content>
          </Layout>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}

export default BtfTypes;
