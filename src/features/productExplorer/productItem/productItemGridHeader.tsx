import { MouseEvent, useCallback } from 'react';
import { Affix, Button, Card, Col, Row, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ProductExplorerSortMetric } from '../../../models';
import {
  selectSortingDirection,
  selectSortingMetric,
  setSortingDirection,
  setSortingMetric,
} from '../productExplorerSlice';

import styles from './productItemGridHeader.module.scss';

const { Text } = Typography;

export const ProductItemGridHeader = () => {
  const dispatch = useAppDispatch();
  const sortingMetric = useAppSelector(selectSortingMetric);
  const sortingDirection = useAppSelector(selectSortingDirection);

  const handleMetricClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const metric = event.currentTarget.dataset.id;
      if (metric) {
        dispatch(setSortingMetric(metric as ProductExplorerSortMetric));
        if (sortingDirection === 'asc') {
          dispatch(setSortingDirection('desc'));
        } else {
          dispatch(setSortingDirection('asc'));
        }
      }
    },
    [sortingDirection, dispatch]
  );

  return (
    <Affix style={{ width: '100%' }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Card className={styles['product-item-grid-header-wide']}>
          <Row>
            <Col
              xs={24}
              sm={24}
              md={5}
              lg={5}
              xl={5}
              className={styles['product-item-grid-header__column']}
            />
            <Col
              xs={24}
              sm={24}
              md={2}
              lg={2}
              xl={2}
              className={styles['product-item-grid-header__column']}
            >
              <Button
                data-id="tvl"
                size="small"
                variant="text"
                color={sortingMetric === 'tvl' ? 'primary' : 'default'}
                onClick={handleMetricClick}
              >
                TVL{' '}
                {sortingMetric === 'tvl' &&
                  (sortingDirection === 'desc' ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  ))}
              </Button>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={2}
              lg={2}
              xl={2}
              className={styles['product-item-grid-header__column']}
            >
              <Button
                data-id="sharePrice"
                size="small"
                variant="text"
                color={sortingMetric === 'sharePrice' ? 'primary' : 'default'}
                onClick={handleMetricClick}
              >
                Share Price{' '}
                {sortingMetric === 'sharePrice' &&
                  (sortingDirection === 'desc' ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  ))}
              </Button>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={2}
              lg={2}
              xl={2}
              className={styles['product-item-grid-header__column']}
            >
              <Button
                data-id="apr"
                size="small"
                variant="text"
                color={sortingMetric === 'apr' ? 'primary' : 'default'}
                onClick={handleMetricClick}
              >
                APR{' '}
                {sortingMetric === 'apr' &&
                  (sortingDirection === 'desc' ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  ))}
              </Button>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={3}
              lg={3}
              xl={3}
              className={styles['product-item-grid-header__column']}
            >
              <Text>Scores</Text>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={2}
              lg={2}
              xl={2}
              className={styles['product-item-grid-header__column']}
            >
              <Text>Overview</Text>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={2}
              lg={2}
              xl={2}
              className={styles['product-item-grid-header__column']}
            >
              <Text>Performance</Text>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={2}
              lg={2}
              xl={2}
              className={styles['product-item-grid-header__column']}
            >
              <Text>Tokens</Text>
            </Col>
          </Row>
        </Card>
      </Col>
    </Affix>
  );
};
