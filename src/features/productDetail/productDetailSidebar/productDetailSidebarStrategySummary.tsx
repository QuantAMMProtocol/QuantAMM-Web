import { FC, useCallback, useEffect, useState } from 'react';
import { Product } from '../../../models';
import { Eli5 } from '../../shared';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';
import { CURRENT_LIVE_FACTSHEETS } from '../../documentation/factSheets/liveFactsheets';
import { Collapse } from 'antd';

interface ProductDetailSidebarStrategySummaryProps {
  product: Product;
}
const STRATEGY_PANEL_KEY = 'strategy';

export const ProductDetailSidebarStrategySummary: FC<
  ProductDetailSidebarStrategySummaryProps
> = ({ product }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const livePools = CURRENT_LIVE_FACTSHEETS;
  const liveProduct = livePools.factsheets.find(
    (p) => p.poolId.toLowerCase() == product.address.toLowerCase()
  );
  const strategyName = liveProduct?.fixedSettings.find(
    (x) => x[0] == 'Strategy'
  )?.[1];

  const handleCollapseChange = useCallback((activeKey: string | string[]) => {
    const isOpen = Array.isArray(activeKey)
      ? activeKey.includes(STRATEGY_PANEL_KEY)
      : activeKey === STRATEGY_PANEL_KEY;
    setIsPanelOpen(isOpen);
  }, []);

  useEffect(() => {
    const maybeOpenForTarget = (target?: string) => {
      if (target === '#summary') {
        setIsPanelOpen(true);
      }
    };

    maybeOpenForTarget(window.location.hash);

    const onHashChange = () => maybeOpenForTarget(window.location.hash);
    const onNavSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail;
      maybeOpenForTarget(detail?.href);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener(
      'product-detail-nav-select',
      onNavSelect as EventListener
    );

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener(
        'product-detail-nav-select',
        onNavSelect as EventListener
      );
    };
  }, []);

  return (
    <>
      <Collapse
        activeKey={isPanelOpen ? [STRATEGY_PANEL_KEY] : []}
        onChange={handleCollapseChange}
        items={[
          {
            key: STRATEGY_PANEL_KEY,
            label: `About ${strategyName ?? ''} Strategy`,
            children: (
              <>
                <ProductDetailSidebarElement
                  side="left"
                  insideTag={false}
                  text={
                    <Eli5
                      strategy={
                        product.strategy == 'NONE'
                          ? product.tokenType
                          : product.strategy
                      }
                    />
                  }
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
};
