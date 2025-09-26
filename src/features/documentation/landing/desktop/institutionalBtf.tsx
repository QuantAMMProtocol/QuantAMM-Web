import { Col, Row } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';

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
        ></ProductItemBackground>
      </Col>
    </Row>
  );
}
