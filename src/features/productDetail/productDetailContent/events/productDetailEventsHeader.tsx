import { FC, memo } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import styles from './productDetailEventsHeader.module.scss';

const { Title } = Typography;

interface EventsHeaderProps {
  isMobile: boolean;
  onCsv: () => void;
  showTitle?: boolean;
}

export const ProductDetailEventsHeader: FC<EventsHeaderProps> = memo(
  function EventsHeader({ isMobile, onCsv, showTitle = true }) {
    return (
      <Title level={4} className={styles.title}>
        <Row>
          <Col span={20}>
            <h4 hidden={isMobile || !showTitle}>Events</h4>
          </Col>
          {!isMobile && (
            <Col span={4} className={styles.actionsCol}>
              <Button
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onCsv();
                }}
                className={styles.csvButton}
              >
                Download CSV
              </Button>
            </Col>
          )}
        </Row>
      </Title>
    );
  }
);
