import { FC } from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { manualTruncate, shortenAddress } from '../../../utils';
import { Product } from '../../../models';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

const { Link, Text } = Typography;

interface ProductDetailSidebarOverviewProps {
  product: Product;
  /** When true, renders a minimalist, mobile-friendly view */
  isMobile?: boolean;
}

export const ProductDetailSidebarOverview: FC<
  ProductDetailSidebarOverviewProps
> = ({ product, isMobile }) => {
  const formatter = Intl.NumberFormat('en');

  const explorerRootUrl: Record<string, string> = {
    MAINNET: 'https://etherscan.io',
    BASE: 'https://basescan.org',
    ARBITRUM: 'https://arbiscan.io',
    SONIC: 'https://sonicscan.org',
  };

  const poolHref =
    explorerRootUrl[product.chain] &&
    product.dynamicData?.poolId
      ? `${explorerRootUrl[product.chain]}/address/${product.dynamicData?.poolId}`
      : undefined;

  const poolType =
    product.strategy === 'NONE' ? product.tokenType : product.strategy;

  const tvl =
    product.dynamicData?.totalLiquidity != null
      ? formatter.format(Number(product.dynamicData.totalLiquidity))
      : '—';

  const vol24h =
    product.dynamicData?.volume24h != null
      ? formatter.format(Number(product.dynamicData.volume24h))
      : '—';

  // ---------- Mobile (minimalist) ----------
  if (isMobile) {
    return (
      <Card
        bordered={false}
        style={{
          background: 'var(--panel-bg, rgba(255,255,255,0.02))',
          borderRadius: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Descriptions
          size="small"
          column={1}
          colon={false}
          labelStyle={{ color: 'var(--muted, #9aa0a6)' }}
          contentStyle={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
            fontWeight: 600,
          }}
        >
          <Descriptions.Item label="Pool ID">
            {poolHref ? (
              <Link href={poolHref} target="_blank">
                {shortenAddress(product.id)}
              </Link>
            ) : (
              <Text strong>{shortenAddress(product.id)}</Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Pool name">
            <Text strong>{manualTruncate(product.name, 16)}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Pool symbol">
            <Text strong>{product.symbol}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Pool chain">
            <Text strong>{product.chain}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Pool type">
            <Text strong>{poolType}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="TVL">
            <Text strong>{tvl}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Volume (24h)">
            <Text strong>{vol24h}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }

  // ---------- Desktop (existing design) ----------
  return (
    <div className={styles['product-detail-info__container']}>
      <ProductDetailSidebarElement side="left" text="Pool ID" />
      <ProductDetailSidebarElement
        side="right"
        text={shortenAddress(product.id)}
        href={poolHref}
        target="_blank"
      />

      <ProductDetailSidebarElement side="left" text="Pool name" />
      <ProductDetailSidebarElement
        side="right"
        text={manualTruncate(product.name, 9)}
      />

      <ProductDetailSidebarElement side="left" text="Pool symbol" />
      <ProductDetailSidebarElement side="right" text={product.symbol} />

      <ProductDetailSidebarElement side="left" text="Pool chain" />
      <ProductDetailSidebarElement side="right" text={product.chain} />

      <ProductDetailSidebarElement side="left" text="Pool type" />
      <ProductDetailSidebarElement side="right" text={poolType} />

      <ProductDetailSidebarElement side="left" text="TVL" />
      <ProductDetailSidebarElement side="right" text={tvl} />

      <ProductDetailSidebarElement side="left" text="Volume (24h)" />
      <ProductDetailSidebarElement side="right" text={vol24h} />
    </div>
  );
};
