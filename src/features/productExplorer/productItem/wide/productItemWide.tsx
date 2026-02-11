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
import { getCurrentPrice, getTvl } from '../productItemHelpers';
import { ProductItemPerformanceLineGraph } from './productItemPerformanceLineGraph';
import { ProductItemTokenList } from './productItemTokenList';
import { ProductItemBackground } from '../productItemBackground';
import { ProductItemApr } from './productItemApr';

import styles from './productItemWide.module.scss';
import { selectAcceptedTermsAndConditions } from '../../productExplorerSlice';

const { Text } = Typography;

interface ProductItemProps {
  product: Product;
}

export const ProductItemWide: FC<ProductItemProps> = ({ product }) => {
  const isDarkTheme = useAppSelector(selectTheme);

  const acceptedTerms = useAppSelector(
    selectAcceptedTermsAndConditions
  );

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

  const shouldShow = useMemo(() => {
    return !!product.timeSeries && product.timeSeries.length > 0;
  }, [product.timeSeries]);

  const LoadingGraph = () => (
    <div className={styles['product-item__card__loading']}>
      <Spin />
    </div>
  );

  const OverviewScoresColumn = () => (
    <Col
      span={3}
      className={
        product.overview.length > 0 ? styles['product-item__card-column'] : undefined
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
          <LoadingGraph />
        </div>
      )}
    </Col>
  );

  const ChartsAndTokensColumns = () => (
    <>
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
          <LoadingGraph />
        )}
      </Col>
      <Col span={2}>
        {shouldShow ? (
          <div className={styles['product-item-graph']}>
            <ProductItemPerformanceLineGraph product={product} wide={true} />
          </div>
        ) : (
          <LoadingGraph />
        )}
      </Col>
      <Col
        span={3}
        className={shouldShow ? styles['product-item__card-column'] : undefined}
        style={
          shouldShow
            ? {
                padding: 0,
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {shouldShow ? <ProductItemTokenList product={product} /> : <LoadingGraph />}
      </Col>
    </>
  );

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

            <Col
              span={2}
              className={styles['product-item__card-column']}
              style={{ padding: 0 }}
            >
              {product.dynamicData?.aprItems?.length ? (
                <ProductItemApr product={product} />
              ) : (
                <Text style={{ fontSize: '12px' }}>No APR data</Text>
              )}
            </Col>

            <OverviewScoresColumn />
            <ChartsAndTokensColumns />

            <Col span={3} className={styles['product-item__card-column-right']}>
              <div className={styles['product-item__card__action']}>
                <Button size="small" type="link">
                  <Link to={`${product.chain}/${product.id}`}>details</Link>
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => showProductModal()}
                  disabled={!acceptedTerms}
                >
                  deposit
                </Button>
              </div>
            </Col>
          </Row>
        </ProductItemBackground>
        <ProductModal
          isWithdraw={false}
          isVisible={!!productModalUrl}
          onClose={hideProductModal}
          url={productModalUrl}
        />
      </Card>
    </div>
  );
};
