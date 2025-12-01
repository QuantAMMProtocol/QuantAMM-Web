import { Card, Col, Image, Row, Space, Tag, Tooltip, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import {
  BtfHeader,
  BTF_TYPES,
  WhiteGloveCta,
  VisionOverviewProps,
} from '../btfTypeShared';

const { Title, Text, Paragraph } = Typography;

export function BtfTypesMobile({
  backgroundColor = '#2c496b',
}: VisionOverviewProps) {
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

            <Space
              direction="vertical"
              size={16}
              style={{ width: '100%', marginTop: 16 }}
            >
              {BTF_TYPES.map((btf) => (
                <Card
                  key={btf.type}
                  bordered
                  style={{ borderRadius: 16 }}
                >
                  <Space align="center" size={12} style={{ marginBottom: 12 }}>
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
                    <Title level={4} style={{ margin: 0 }}>
                      {btf.type}
                    </Title>
                  </Space>
                  <Paragraph style={{ marginBottom: 12 }}>
                    {btf.description}
                  </Paragraph>
                  <div>
                    <Text strong>Key benefits</Text>
                    <div style={{ marginTop: 8 }}>
                      {btf.benefits.map((b) => (
                        <div key={b[0]} style={{ marginBottom: 6 }}>
                          <Tooltip title={b[1]}>
                            <Tag>{b[0]}</Tag>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
            <WhiteGloveCta variant="mobile" />
          </div>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}

export default BtfTypesMobile;
