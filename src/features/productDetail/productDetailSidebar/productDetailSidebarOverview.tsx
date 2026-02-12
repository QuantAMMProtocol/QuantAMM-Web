import { FC, ReactNode } from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { shortenAddress } from '../../../utils';
import { Product } from '../../../models';

import styles from './productDetailInfo.module.scss';

const { Link, Text } = Typography;

interface ProductDetailSidebarOverviewProps {
  product: Product;
  /** When true, renders a minimalist, mobile-friendly view */
  isMobile?: boolean;
}

const InfoRow: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className={styles['product-detail-info__row']}>
    <div className={styles['product-detail-info__label']}>{label}</div>
    <div className={styles['product-detail-info__value']}>{children}</div>
  </div>
);

const ValueText: FC<{
  text: string;
  title?: string;
  href?: string;
  target?: string;
}> = ({ text, title, href, target }) => {
  const content = (
    <span className={styles['product-detail-info__valueText']} title={title}>
      {text}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      className={styles['product-detail-info__valueLink']}
    >
      {content}
    </Link>
  );
};

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

  const poolId = product.dynamicData?.poolId ?? product.id;
  const root = explorerRootUrl[product.chain];

  const poolHref = root && poolId ? `${root}/address/${poolId}` : undefined;

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
            textAlign: 'left',
            fontWeight: 600,
          }}
        >
          <Descriptions.Item label="Pool ID">
            {poolHref ? (
              <Link href={poolHref} target="_blank" rel="noreferrer">
                {shortenAddress(poolId)}
              </Link>
            ) : (
              <Text strong>{shortenAddress(poolId)}</Text>
            )}
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

  // ---------- Desktop (clean row-cards) ----------
  return (
    <div className={styles['product-detail-info__container']}>
      <InfoRow label="TVL">
        <ValueText text={tvl} title={tvl} />
      </InfoRow>
      <InfoRow label="Pool chain">
        <ValueText text={product.chain ?? '—'} title={product.chain ?? ''} />
      </InfoRow>

      <InfoRow label="Pool type">
        <ValueText text={poolType ?? '—'} title={poolType ?? ''} />
      </InfoRow>
      <InfoRow label="Volume (24h)">
        <ValueText text={vol24h} title={vol24h} />
      </InfoRow>
    </div>
  );
};
