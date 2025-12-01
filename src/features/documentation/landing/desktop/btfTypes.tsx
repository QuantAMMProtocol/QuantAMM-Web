import { Card, Col, Empty, Image, Row, Tag, Tooltip, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import {
  BtfHeader,
  BTF_TYPES,
  HEADER_MIN_HEIGHT,
  DESCRIPTION_MIN_HEIGHT,
  BENEFITS_MIN_HEIGHT,
  WhiteGloveCta,
  VisionOverviewProps,
} from '../btfTypeShared';

const { Title, Text, Paragraph } = Typography;

export function BtfTypes({ backgroundColor = '#2c496b' }: VisionOverviewProps) {
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
                                    marginLeft: 0,
                                    marginTop: 5,
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
