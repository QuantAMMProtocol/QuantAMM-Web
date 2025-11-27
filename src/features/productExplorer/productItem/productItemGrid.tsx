import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Layout, Row } from 'antd';
import autoAnimate from '@formkit/auto-animate';
import { ProductItem } from './card/productItem';
import { useAppSelector } from '../../../app/hooks';
import {
  selectLoadingProducts,
  selectPageSize,
  selectProducts,
} from '../productExplorerSlice';
import { ProductExplorerSort } from '../productExplorerSort/productExplorerSort';
import { ProductExplorerTabOverride } from '../productExplorerTabOverride/productExplorerTabOverride';
import { ProductExplorerPagination } from '../ProductExplorerPagination';
import { useSort } from './useSort';
import { ProductItemWide } from './wide/productItemWide';
import { ProductItemGridHeader } from './productItemGridHeader';
import { ProductItemLoading } from './card/productItemLoading';
import { ProductItemWideLoading } from './wide/productItemWideLoading';
import { StyleProvider } from '@ant-design/cssinjs';

import styles from './productItemGrid.module.scss';

const { Content } = Layout;

interface ProductItemGridProps {
  wide: boolean;
}

export const ProductItemGrid: FC<ProductItemGridProps> = ({ wide }) => {
  const parent = useRef<HTMLDivElement | null>(null);
  const [, setRefVisible] = useState(false);

  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectLoadingProducts);
  const pageSize = useAppSelector(selectPageSize);
  const { sort } = useSort();

  const areProductsLoaded = useMemo(
    () => Object.keys(products).length > 0,
    [products]
  );

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent.current]);

  const loadingProducts = Array.from(
    {
      length: pageSize,
    },
    (_, index) => index
  );

  return (

    <StyleProvider hashPriority="low">
    <Layout>
      <div className={styles['product-item-grid__header']}>
        <Row
          gutter={[0, 16]}
          justify={{
            xs: 'center',
            sm: 'center',
            md: 'center',
            lg: 'center',
            xl: 'start',
          }}
          align="middle"
          style={{ height: 'auto', width: '100%' }}
        >
          {!wide && (
            <>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <ProductExplorerTabOverride />
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <ProductExplorerSort />
              </Col>
            </>
          )}
        </Row>
      </div>
      <Content className={styles['product-item-grid__content']}>
        <Row
          ref={(element: HTMLDivElement) => {
            parent.current = element;
            setRefVisible(!!element);
          }}
          gutter={[8, 8]}
          justify={{
            xs: 'center',
            sm: 'center',
            md: 'center',
            lg: 'center',
            xl: 'start',
          }}
        >
          {wide && <ProductItemGridHeader />}
          {(loading || !areProductsLoaded) &&
            loadingProducts.map((loadingProduct) => (
              <Col xs={wide ? 24 : undefined} key={loadingProduct}>
                {wide ? <ProductItemWideLoading /> : <ProductItemLoading />}
              </Col>
            ))}
          {!loading &&
            areProductsLoaded &&
            sort(Object.values(products)).map((product) => (
                <Col xs={wide ? 24 : undefined} key={product.id}>
                  {wide ? (
                    <ProductItemWide product={product} />
                  ) : (
                    <ProductItem product={product} />
                  )}
                </Col>
            ))}
        </Row>
        {!loading && areProductsLoaded && (
          <Row style={{ marginTop: 16 }} justify="center">
            <ProductExplorerPagination />
          </Row>
        )}
      </Content>
    </Layout>
    </StyleProvider>
  );
};
