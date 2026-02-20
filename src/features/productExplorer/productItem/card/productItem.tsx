import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Row, TabsProps, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectOverrideTab, setOverrideTab } from '../../productExplorerSlice';
import { CURRENT_PERFORMANCE_PERIOD, Product } from '../../../../models';
import { selectTheme } from '../../../themes/themeSlice';
import {
  ProductItemCompositionGraph,
  ProductItemOverviewGraph,
} from '../../../shared';
import { ProductItemTabs } from '../tabs/productItemTabs';
import { getCurrentPerformanceComponent } from '../shared/CurrentPerformance';
import { getTimeDifference } from '../shared/TimeDifference';
import { ProductItemPerformanceAreaGraph } from './productItemPerformanceAreaGraph';
import { ProductItemBottom } from './productItemBottom';
import { ProductItemBackground } from '../productItemBackground';
import { getTvl } from '../productItemHelpers';
import styles from './productItem.module.scss';

const DEFAULT_ACTIVE_KEY = '1';

const { Text } = Typography;

interface ProductItemProps {
  product: Product;
}

export const ProductItem: FC<ProductItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const overrideTab = useAppSelector(selectOverrideTab);
  const isDarkTheme = useAppSelector(selectTheme);

  const [activeKey, setActiveKey] = useState<string>(DEFAULT_ACTIVE_KEY);

  const items: TabsProps['items'] = useMemo(() => {
    return [
      {
        key: '1',
        label: 'overview',
        children:
          activeKey === '1' ? (
            <div className={styles['product-item-graph']}>
              <ProductItemOverviewGraph
                data={product.overview}
                isDarkTheme={isDarkTheme}
                showScoreOverall
              />
            </div>
          ) : (
            <></>
          ),
      },
      {
        key: '2',
        label: 'performance',
        children:
          activeKey === '2' ? (
            <div className={styles['product-item-graph']}>
              {product.oneWeekPerformance &&
              product.oneMonthPerformance &&
              product.threeMonthPerformance &&
              product.sixMonthPerformance &&
              product.oneYearPerformance &&
              product.inceptionPerformance ? (
                <ProductItemPerformanceAreaGraph
                  data={[
                    product.inceptionPerformance,
                    product.oneWeekPerformance,
                    product.oneMonthPerformance,
                    product.threeMonthPerformance,
                    product.sixMonthPerformance,
                    product.oneYearPerformance,
                  ]}
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          ),
      },
      {
        key: '3',
        label: 'tokens',
        children:
          activeKey === '3' ? (
            <div className={styles['product-item-graph']}>
              <ProductItemCompositionGraph data={product.poolConstituents} />
            </div>
          ) : (
            <></>
          ),
      },
    ];
  }, [product, activeKey, isDarkTheme]);

  const overrideActiveKey = useMemo(
    () =>
      (items || []).find((item) => {
        return item.label === overrideTab;
      })?.key,
    [items, overrideTab]
  );

  const handleChange = useCallback(
    (activeKey: string) => {
      dispatch(setOverrideTab(undefined));
      setActiveKey(activeKey);
    },
    [dispatch]
  );

  useEffect(() => {
    if (overrideActiveKey) {
      setActiveKey(overrideActiveKey);
    }
  }, [overrideActiveKey]);

  return (
    <div
      className={
        isDarkTheme
          ? [
              styles['product-item__card-container__dark'],
              styles['product-item__card-container'],
            ].join(' ')
          : [
              styles['product-item__card-container__light'],
              styles['product-item__card-container'],
            ].join(' ')
      }
    >
      <Card className={styles['product-item__card']} hoverable>
        <ProductItemBackground>
          <div className={styles['product-item__card__top']}>
            <Text
              title={product.name}
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {product.name}
            </Text>
          </div>
          <Row className={styles['product-item__card-under-body']}>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text className={styles['product-item__card-under-body__text']}>
                TVL{' '}
                <span style={{ color: 'var(--secondary-text-color)' }}>
                  {getTvl(product)}
                </span>
              </Text>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text className={styles['product-item__card-under-body__text']}>
                {CURRENT_PERFORMANCE_PERIOD}{' '}
                {getCurrentPerformanceComponent(product)}
              </Text>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text className={styles['product-item__card-under-body__text']}>
                age{' '}
                <span style={{ color: 'var(--secondary-lighter)' }}>
                  {getTimeDifference(product.createTime)}
                </span>
              </Text>
            </Col>
          </Row>
          <Row className={styles['product-item__card-body']}>
            <Col span={24}>
              <ProductItemTabs
                items={items}
                activeKey={activeKey}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <ProductItemBottom product={product} />
        </ProductItemBackground>
      </Card>
    </div>
  );
};
