import { memo, useEffect, useState } from 'react';
import { Affix, Anchor, Button } from 'antd';
import { getBalancerPoolUrl } from '../../../utils';
import { ProductModal } from '../modal/productModal';

import styles from './productDetailNav.module.scss';
import { useAppSelector } from '../../../app/hooks';
import { selectAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';

interface ProductDetailNavProps {
  productId: string;
  chain: string;
}

function ProductDetailNavInternal({ productId, chain }: ProductDetailNavProps) {
  console.log('Rendering ProductDetailNav with productId:', productId);

  const acceptedTermsAndConditions = useAppSelector(
    selectAcceptedTermsAndConditions
  );
  const [targetOffset, setTargetOffset] = useState<number | undefined>(
    undefined
  );
  const [productModalUrl, setProductModalUrl] = useState<string | undefined>(
    undefined
  );
  const [isWithdraw, setIsWithdraw] = useState(false);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  const showProductModal = (url: string) => {
    setProductModalUrl(url);
  };

  const hideProductModal = () => {
    setProductModalUrl(undefined);
  };

  const baseBalancerUrl = getBalancerPoolUrl(chain, productId);
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
              onClick={() => {
                showProductModal(addLiquidityBalancerPoolUrl);
                setIsWithdraw(false);
              }}
              disabled={!acceptedTermsAndConditions}
            >
              Deposit
            </Button>
            <Button
              onClick={() => {
                showProductModal(removeLiquidityBalancerPoolUrl);
                setIsWithdraw(true);
              }}
              disabled={!acceptedTermsAndConditions}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Affix>
      <ProductModal
        isWithdraw={isWithdraw}
        isVisible={!!productModalUrl}
        onClose={hideProductModal}
        url={productModalUrl}
      />
    </>
  );
}

export const ProductDetailNav = memo(ProductDetailNavInternal);
