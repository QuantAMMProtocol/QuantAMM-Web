import { FC, useMemo } from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { Product } from '../../../models';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

const { Link, Text } = Typography;

interface ProductDetailSidebarPoolInfoProps {
  product: Product;
  /** When true, renders a minimalist, mobile-friendly view */
  isMobile?: boolean;
}

export const ProductDetailSidebarPoolInfo: FC<
  ProductDetailSidebarPoolInfoProps
> = ({ product, isMobile }) => {
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

  const runnerAddr = strategyRunnerContractAddresses[product.chain];
  const factoryAddr = factoryAddress[product.chain];
  const root = explorerRootUrl[product.chain];

  const runnerHref = `${root}/address/${runnerAddr}`;
  const factoryHref = `${root}/address/${factoryAddr}`;

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
          <Descriptions.Item label="Strategy runner contract">
            <Link href={runnerHref} target="_blank">
              {runnerAddr.slice(0, 6)}…{runnerAddr.slice(-4)}
            </Link>
          </Descriptions.Item>

          <Descriptions.Item label="Pool Factory contract">
            <Link href={factoryHref} target="_blank">
              {factoryAddr.slice(0, 6)}…{factoryAddr.slice(-4)}
            </Link>
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

  // -------------------- Desktop (existing layout) --------------------
  return (
    <div className={styles['product-detail-info__container']}>
      <ProductDetailSidebarElement side="left" text="Strategy runner contract" />
      <ProductDetailSidebarElement
        side="right"
        href={runnerHref}
        target="_blank"
        text="Contract"
      />

      <ProductDetailSidebarElement side="left" text="Pool Factory contract" />
      <ProductDetailSidebarElement
        side="right"
        href={factoryHref}
        target="_blank"
        text="Contract"
      />

      <ProductDetailSidebarElement side="left" text="Strategy update interval" />
      <ProductDetailSidebarElement side="right" text={product.frequency} />

      <ProductDetailSidebarElement side="left" text="Fee 24h" />
      <ProductDetailSidebarElement side="right" text={fees24h} />

      <ProductDetailSidebarElement side="left" text="Swap fee" />
      <ProductDetailSidebarElement side="right" text={swapFee} />

      <ProductDetailSidebarElement side="left" text="Swap Fee Manager" />
      <ProductDetailSidebarElement side="right" text={yesNo(product.swapManager)} />

      <ProductDetailSidebarElement side="left" text="Pause Manager" />
      <ProductDetailSidebarElement side="right" text={yesNo(product.pauseManager)} />

      <ProductDetailSidebarElement side="left" text="Disable Unbalanced Liquidity" />
      <ProductDetailSidebarElement
        side="right"
        text={yesNo(product.disableUnbalancedLiquidity)}
      />

      <ProductDetailSidebarElement side="left" text="Add Liquidity Custom" />
      <ProductDetailSidebarElement
        side="right"
        text={yesNo(product.enableAddLiquidityCustom)}
      />

      <ProductDetailSidebarElement side="left" text="Remove Liquidity Custom" />
      <ProductDetailSidebarElement
        side="right"
        text={yesNo(product.enableRemoveLiquidityCustom)}
      />

      <ProductDetailSidebarElement side="left" text="Creation Date" />
      <ProductDetailSidebarElement side="right" text={product.createTime} />
    </div>
  );
};
