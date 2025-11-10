import { FC, memo } from 'react';
import { Button, Col, Row, Typography } from 'antd';

const { Title } = Typography;

interface EventsHeaderProps {
  isMobile: boolean;
  onCsv: () => void;
}

export const ProductDetailEventsHeader: FC<EventsHeaderProps> = memo(function EventsHeader({ isMobile, onCsv }) {
  return (
    <Title level={4} style={{ width: '90%', marginBottom: 0, paddingLeft: 8, paddingTop: 8 }}>
      <Row>
        <Col span={20}>
          <h4 hidden={isMobile}>Events</h4>
        </Col>
        {!isMobile && (
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type="primary" size="small" onClick={onCsv} style={{ marginTop: 20 }}>
              Download CSV
            </Button>
          </Col>
        )}
      </Row>
    </Title>
  );
});
