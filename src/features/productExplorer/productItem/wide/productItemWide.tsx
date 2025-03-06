import { FC, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, List, Row, Spin, Typography } from 'antd';
import { useAppSelector } from '../../../../app/hooks';
import { Product } from '../../../../models';
import { selectTheme } from '../../../themes/themeSlice';
import { ProductItemOverviewGraph } from '../../../shared';
import { getScoreColor, MAX_SCORE } from '../../../shared/graphs/helpers';
import { ProductModal } from '../../../productDetail/modal/productModal';
import { getBalancerPoolUrl } from '../../../../utils';
import { productExplorerTranslation } from '../../translations';
import { percentageFormatter } from '../../../../utils/formatters';
import { getTimeDifference } from '../shared/TimeDifference';
import { getCurrentPrice, getTvl } from '../productItemHelpers';
import { ProductItemPerformanceLineGraph } from './productItemPerformanceLineGraph';
import { ProductItemBackground } from '../productItemBackground';

import styles from './productItemWide.module.scss';

const { Text } = Typography;

interface ProductItemProps {
  product: Product;
}

export const ProductItemWide: FC<ProductItemProps> = ({ product }) => {
  const isDarkTheme = useAppSelector(selectTheme);

  const [productModalUrl, setProductModalUrl] = useState<string | undefined>(
    undefined
  );

  const baseBalancerUrl = getBalancerPoolUrl(product.chain, product.id);
  const addLiquidityBalancerPoolUrl = `${baseBalancerUrl}/add-liquidity`;

  const showProductModal = () => {
    setProductModalUrl(addLiquidityBalancerPoolUrl);
  };

  const hideProductModal = () => {
    setProductModalUrl(undefined);
  };

  const tvl = useMemo(() => {
    return getTvl(product);
  }, [product]);

  const currentPrice = useMemo(() => {
    return getCurrentPrice(product);
  }, [product]);

  const totalWeight = useMemo(() => {
    return product.poolConstituents.reduce(
      (acc, token) => acc + token.weight,
      0
    );
  }, [product]);

  const tokenList = useMemo(() => {
    const mappedTokens = product.poolConstituents.map((token) => [
      token.coin,
      token.weight / totalWeight,
    ]);

    const firstColumn = mappedTokens.slice(0, 3);
    const secondColumn = mappedTokens.slice(3);

    return secondColumn.length > 0
      ? [firstColumn, secondColumn]
      : [mappedTokens];
  }, [product, totalWeight]);

  const shouldShow = useMemo(() => {
    return product.timeSeries && product.timeSeries.length > 0;
  }, [product]);

  return (
    <div
      className={
        isDarkTheme
          ? [
              styles['product-item__card-container__dark'],
              styles['product-item-wide__card-container'],
            ].join(' ')
          : [
              styles['product-item__card-container__light'],
              styles['product-item-wide__card-container'],
            ].join(' ')
      }
    >
      <Card className={styles['product-item__card']} hoverable>
        <ProductItemBackground wide>
          <Row>
            <Col
              span={5}
              className={styles['product-item__card-column-left']}
              style={{ position: 'relative' }}
            >
              <div className={styles['product-item__card__title']}>
                <Text
                  ellipsis={{ tooltip: product.name }}
                  className={styles['product-item__card-top__text']}
                >
                  {product.name}
                </Text>
              </div>
              <div className={styles['product-item__card__title-chain']}>
                <Text>{productExplorerTranslation[product.chain]}</Text>
              </div>
            </Col>

            <Col span={2} className={styles['product-item__card-column']}>
              <Text className={styles['product-item__card-under-body__text']}>
                <span style={{ color: 'var(--secondary-text-color)' }}>
                  {tvl ? tvl : <Spin />}
                </span>
              </Text>
            </Col>

            <Col span={2} className={styles['product-item__card-column']}>
              <Text className={styles['product-item__card-under-body__text']}>
                <span style={{ color: 'var(--secondary-text-color)' }}>
                  {currentPrice ? currentPrice : <Spin />}
                </span>
              </Text>
            </Col>

            <Col span={2} className={styles['product-item__card-column']}>
              <Text className={styles['product-item__card-under-body__text']}>
                <span style={{ color: 'var(--secondary-lighter)' }}>
                  {getTimeDifference(product.createTime)}
                </span>
              </Text>
            </Col>

            <Col
              span={3}
              className={
                product.overview.length > 0
                  ? styles['product-item__card-column']
                  : undefined
              }
            >
              {product.overview.length > 0 ? (
                <List
                  dataSource={Object.entries(product.overview)}
                  renderItem={(item) => (
                    <List.Item style={{ padding: 0 }}>
                      <Text
                        className={styles['product-item__card-scores__text']}
                        style={{
                          color: getScoreColor(Number(item[1].value)),
                        }}
                      >
                        {String(item[1].metric)}
                      </Text>
                      <Text
                        className={styles['product-item__card-scores__text']}
                        style={{
                          color: getScoreColor(Number(item[1].value)),
                          marginLeft: 4,
                        }}
                      >
                        {String(item[1].value)} / {MAX_SCORE}
                      </Text>
                    </List.Item>
                  )}
                />
              ) : (
                <div className={styles['product-item-graph']}>
                  <div className={styles['product-item__card__loading']}>
                    <Spin />
                  </div>
                </div>
              )}
            </Col>

            <Col span={2}>
              {product.overview.length > 0 ? (
                <div className={styles['product-item-graph']}>
                  <ProductItemOverviewGraph
                    data={product.overview}
                    isDarkTheme={isDarkTheme}
                    wide={true}
                    showScoreOverall={true}
                  />
                </div>
              ) : (
                <div className={styles['product-item__card__loading']}>
                  <Spin />
                </div>
              )}
            </Col>
            <Col span={2}>
              {shouldShow ? (
                <div className={styles['product-item-graph']}>
                  <ProductItemPerformanceLineGraph
                    product={product}
                    wide={true}
                  />
                </div>
              ) : (
                <div className={styles['product-item__card__loading']}>
                  <Spin />
                </div>
              )}
            </Col>
            <Col
              span={3}
              className={styles['product-item__card-column']}
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                overflow: 'hidden',
              }}
            >
              <div
                className={
                  tokenList.length > 1
                    ? styles['product-item__card-token-list__double']
                    : styles['product-item__card-token-list']
                }
              >
                {tokenList.length > 0 &&
                  tokenList.map((column, index) => (
                    <List
                      key={index}
                      dataSource={column}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            padding: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            className={styles['product-item__card-token']}
                            title={String(item[0])}
                          >
                            {String(item[0])}
                          </Text>
                          <Text
                            className={styles['product-item__card-token']}
                            style={{
                              marginLeft: 4,
                              minWidth: 35,
                              textAlign: 'right',
                            }}
                          >
                            {percentageFormatter(Number(item[1]) * 100)}
                          </Text>
                        </List.Item>
                      )}
                    />
                  ))}
              </div>
            </Col>

            <Col span={3} className={styles['product-item__card-column-right']}>
              <div className={styles['product-item__card__action']}>
                <Button size="small" type="link">
                  <Link to={`${product.chain}/${product.id}`}>details</Link>
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => showProductModal()}
                >
                  deposit
                </Button>
              </div>
            </Col>
          </Row>
        </ProductItemBackground>
        <ProductModal
          isVisible={!!productModalUrl}
          onClose={hideProductModal}
          url={productModalUrl}
        />
      </Card>
    </div>
  );
};
