import { FC, useEffect, useState } from 'react';
import { Affix, Anchor, Button } from 'antd';
import { Product } from '../../../models';
import { getBalancerPoolUrl } from '../../../utils';
import { ProductModal } from '../modal/productModal';

import styles from './productDetailNav.module.scss';

interface ProductDetailNavProps {
  product: Product;
}

export const ProductDetailNav: FC<ProductDetailNavProps> = ({ product }) => {
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [productModalUrl, setProductModalUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  const showProductModal = (url: string) => {
    setProductModalUrl(url);
  };

  const hideProductModal = () => {
    setProductModalUrl(undefined);
  };

  const baseBalancerUrl = getBalancerPoolUrl(product.chain, product.id);
  const addLiquidityBalancerPoolUrl = `${baseBalancerUrl}/add-liquidity`;
  const removeLiquidityBalancerPoolUrl = `${baseBalancerUrl}/remove-liquidity`;

  return (
    <>
      <Affix>
        <div className={styles['product-detail-nav__container']}>
          <div className={styles['product-detail-nav__anchor-container']}>
            <Anchor
              targetOffset={targetOffset}
              direction="horizontal"
              affix
              className={styles['product-detail-nav__anchor']}
              items={[
                {
                  key: 'graph',
                  href: '#graph',
                  title: 'Graph',
                },
                {
                  key: 'summary',
                  href: '#summary',
                  title: 'Summary',
                },
                {
                  key: 'details',
                  href: '#details',
                  title: 'Details',
                },
                {
                  key: 'events',
                  href: '#events',
                  title: 'Events',
                },
              ]}
            />
          </div>

          <div className={styles['product-detail-nav__buttons-container']}>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => showProductModal(addLiquidityBalancerPoolUrl)}
            >
              Deposit
            </Button>
            <Button
              onClick={() => showProductModal(removeLiquidityBalancerPoolUrl)}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Affix>
      <ProductModal
        isVisible={!!productModalUrl}
        onClose={hideProductModal}
        url={productModalUrl}
      />
    </>
  );
};
