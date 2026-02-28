import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { Affix, Anchor, Button } from 'antd';
import { getBalancerPoolUrl } from '../../../utils';
import { ProductModal } from '../modal/productModal';

import styles from './productDetailNav.module.scss';
import { useAppSelector } from '../../../app/hooks';
import { selectAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';

const PRODUCT_DETAIL_SCROLL_CONTAINER_ID = 'product-detail-scroll-container';

interface ProductDetailNavProps {
  productId: string;
  chain: string;
}

function ProductDetailNavInternal({ productId, chain }: ProductDetailNavProps) {
  const acceptedTermsAndConditions = useAppSelector(
    selectAcceptedTermsAndConditions
  );
  const [targetOffset, setTargetOffset] = useState<number | undefined>(120);
  const [anchorContainer, setAnchorContainer] = useState<HTMLElement | null>(
    null
  );
  const [productModalUrl, setProductModalUrl] = useState<string | undefined>(
    undefined
  );
  const [isWithdraw, setIsWithdraw] = useState(false);

  useEffect(() => {
    // Track sections relative to the product detail scroll container.
    setAnchorContainer(
      document.getElementById(PRODUCT_DETAIL_SCROLL_CONTAINER_ID)
    );
    setTargetOffset(120);
  }, [productId]);

  const showProductModal = (url: string) => {
    setProductModalUrl(url);
  };

  const hideProductModal = () => {
    setProductModalUrl(undefined);
  };

  const baseBalancerUrl = getBalancerPoolUrl(chain, productId);
  const addLiquidityBalancerPoolUrl = `${baseBalancerUrl}/add-liquidity`;
  const removeLiquidityBalancerPoolUrl = `${baseBalancerUrl}/remove-liquidity`;
  const getAnchorContainer = useCallback(() => {
    return anchorContainer ?? document.documentElement;
  }, [anchorContainer]);
  const anchorItems = useMemo(
    () => [
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
        key: 'metrics',
        href: '#metrics',
        title: 'Metrics',
      },
      {
        key: 'events',
        href: '#events',
        title: 'Events',
      },
      {
        key: 'distribution',
        href: '#distribution',
        title: 'Distribution',
      },
    ],
    []
  );
  const handleAnchorClick = useCallback(
    (_event: ReactMouseEvent<HTMLElement>, link: any) => {
      window.dispatchEvent(
        new CustomEvent('product-detail-nav-select', {
          detail: { href: link?.href },
        })
      );
    },
    []
  );

  return (
    <>
      <Affix>
        <div className={styles['product-detail-nav__container']}>
          <div className={styles['product-detail-nav__anchor-container']}>
            {anchorContainer && (
              <Anchor
                targetOffset={targetOffset}
                direction="horizontal"
                affix={false}
                className={styles['product-detail-nav__anchor']}
                getContainer={getAnchorContainer}
                items={anchorItems}
                onClick={handleAnchorClick}
              />
            )}
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
