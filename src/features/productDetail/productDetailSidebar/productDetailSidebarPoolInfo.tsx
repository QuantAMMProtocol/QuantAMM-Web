import { FC, ReactNode, useMemo } from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { Product } from '../../../models';

import styles from './productDetailInfo.module.scss';

const { Link, Text } = Typography;

interface ProductDetailSidebarPoolInfoProps {
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

export const ProductDetailSidebarPoolInfo: FC<ProductDetailSidebarPoolInfoProps> =
  ({ product, isMobile }) => {
    const formatter = useMemo(() => Intl.NumberFormat('en'), []);

    const strategyRunnerContractAddresses: Record<string, string> = {
      MAINNET: '0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748',
      BASE: '0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
      ARBITRUM: '0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
      SONIC: '0xD5c43063563f9448cE822789651662cA7DcD5773',
    };

    const factoryAddress: Record<string, string> = {
      MAINNET: '0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748',
      BASE: '0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
      ARBITRUM: '0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
      SONIC: '0x60006d255569b36a3d494e83D182b57acd04D484',
    };

    const explorerRootUrl: Record<string, string> = {
      MAINNET: 'https://etherscan.io',
      BASE: 'https://basescan.org',
      ARBITRUM: 'https://arbiscan.io',
      SONIC: 'https://sonicscan.org',
    };

    const root = explorerRootUrl[product.chain];
    const runnerAddr = strategyRunnerContractAddresses[product.chain];
    const factoryAddr = factoryAddress[product.chain];

    const makeHref = (addr?: string) =>
      root && addr ? `${root}/address/${addr}` : undefined;

    const shortAddr = (addr?: string) =>
      addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '—';

    const runnerHref = makeHref(runnerAddr);
    const factoryHref = makeHref(factoryAddr);

    const fees24h =
      product.dynamicData?.fees24h != null
        ? formatter.format(Number(product.dynamicData.fees24h))
        : '—';

    const swapFee =
      product.dynamicData?.swapFee != null
        ? formatter.format(Number(product.dynamicData.swapFee))
        : '—';

    const yesNo = (v: unknown) =>
      (v as any)?.valueOf?.().toString?.() === 'true' ? 'Yes' : 'No';

    // -------------------- Mobile (minimalist) --------------------
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
           <Descriptions.Item label="Pool Contract">
              {runnerHref ? (
                <Link href={runnerHref} target="_blank" rel="noreferrer">
                  {shortAddr(product.dynamicData?.poolId ?? product.id)}
                </Link>
              ) : (
                <Text strong>{shortAddr(runnerAddr)}</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Pool chain">
              <Text strong>{product.chain}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Strategy runner contract">
              {runnerHref ? (
                <Link href={runnerHref} target="_blank" rel="noreferrer">
                  {shortAddr(runnerAddr)}
                </Link>
              ) : (
                <Text strong>{shortAddr(runnerAddr)}</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Pool Factory contract">
              {factoryHref ? (
                <Link href={factoryHref} target="_blank" rel="noreferrer">
                  {shortAddr(factoryAddr)}
                </Link>
              ) : (
                <Text strong>{shortAddr(factoryAddr)}</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Strategy update interval">
              <Text strong>{product.frequency ?? '—'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Fee 24h">
              <Text strong>{fees24h}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Swap fee">
              <Text strong>{swapFee}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Swap Fee Manager">
              <Text strong>{yesNo(product.swapManager)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Pause Manager">
              <Text strong>{yesNo(product.pauseManager)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Disable Unbalanced Liquidity">
              <Text strong>{yesNo(product.disableUnbalancedLiquidity)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Add Liquidity Custom">
              <Text strong>{yesNo(product.enableAddLiquidityCustom)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Remove Liquidity Custom">
              <Text strong>{yesNo(product.enableRemoveLiquidityCustom)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Creation Date">
              <Text strong>{product.createTime ?? '—'}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      );
    }

    // -------------------- Desktop (clean row-cards) --------------------
    return (
      <div className={styles['product-detail-info__container']}>
        <InfoRow label="Strategy runner contract">
          <ValueText
            text={shortAddr(runnerAddr)}
            title={runnerAddr}
            href={runnerHref}
            target="_blank"
          />
        </InfoRow>

        <InfoRow label="Pool Factory contract">
          <ValueText
            text={shortAddr(factoryAddr)}
            title={factoryAddr}
            href={factoryHref}
            target="_blank"
          />
        </InfoRow>

        <InfoRow label="Strategy update interval">
          <ValueText text={product.frequency ?? '—'} title={product.frequency ?? ''} />
        </InfoRow>

        <InfoRow label="Fee 24h">
          <ValueText text={fees24h} title={fees24h} />
        </InfoRow>

        <InfoRow label="Swap fee">
          <ValueText text={swapFee} title={swapFee} />
        </InfoRow>

        <InfoRow label="Swap Fee Manager">
          <ValueText text={yesNo(product.swapManager)} title={yesNo(product.swapManager)} />
        </InfoRow>

        <InfoRow label="Pause Manager">
          <ValueText text={yesNo(product.pauseManager)} title={yesNo(product.pauseManager)} />
        </InfoRow>

        <InfoRow label="Disable Unbalanced Liquidity">
          <ValueText
            text={yesNo(product.disableUnbalancedLiquidity)}
            title={yesNo(product.disableUnbalancedLiquidity)}
          />
        </InfoRow>

        <InfoRow label="Add Liquidity Custom">
          <ValueText
            text={yesNo(product.enableAddLiquidityCustom)}
            title={yesNo(product.enableAddLiquidityCustom)}
          />
        </InfoRow>

        <InfoRow label="Remove Liquidity Custom">
          <ValueText
            text={yesNo(product.enableRemoveLiquidityCustom)}
            title={yesNo(product.enableRemoveLiquidityCustom)}
          />
        </InfoRow>

        <InfoRow label="Creation Date">
          <ValueText text={product.createTime ?? '—'} title={product.createTime ?? ''} />
        </InfoRow>
      </div>
    );
  };
