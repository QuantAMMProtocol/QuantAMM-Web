import { Button, Card, Col, Progress, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import { FC, isValidElement, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../../app/hooks';
import { Product } from '../../../../models';
import { getBalancerPoolUrl } from '../../../../utils';

import { ProductModal } from '../../../productDetail/modal/productModal';
import { ProductItemOverviewGraph } from '../../../shared';
import { getScoreColor, MAX_SCORE } from '../../../shared/graphs/helpers';
import { selectTheme } from '../../../themes/themeSlice';

import { selectAcceptedTermsAndConditions } from '../../productExplorerSlice';
import { productExplorerTranslation } from '../../translations';

import { ProductItemBackground } from '../productItemBackground';
import { getCurrentPrice, getTvl } from '../productItemHelpers';
import { getCurrentPerformanceComponent } from '../shared/CurrentPerformance';

import { ProductItemApr } from './productItemApr';

import styles from './productItemWide.module.scss';

const { Text } = Typography;

interface ProductItemWideProps {
  product: Product;
}

interface ScoreSummary {
  total: number;
  max: number;
  percent: number;
  color: string;
}

interface TokenSummaryItem {
  coin: string;
  pct: number;
}

const formatPct = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}%`;
};

const humanizeEnum = (value: string): string => {
  if (!value) return '';
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const safeIsoDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return undefined;
  return new Date(ts).toISOString().slice(0, 10);
};

const extractTextFromNode = (node: unknown): string | undefined => {
  if (node === null || node === undefined) return undefined;
  if (typeof node === 'string' || typeof node === 'number') return String(node);

  if (Array.isArray(node)) {
    const parts = node
      .map((n) => extractTextFromNode(n))
      .filter((p): p is string => !!p);
    return parts.length ? parts.join('') : undefined;
  }

  if (isValidElement(node)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return extractTextFromNode((node.props as any)?.children);
  }

  return undefined;
};

const parsePercentText = (value?: string): number | undefined => {
  if (!value) return undefined;
  const cleaned = value.replace('%', '').replace(',', '').trim();
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : undefined;
};

export const ProductItemWide: FC<ProductItemWideProps> = ({
  product,
}) => {
  const isDarkTheme = useAppSelector(selectTheme);
  const acceptedTerms = useAppSelector(selectAcceptedTermsAndConditions);

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

  const tvl = useMemo(() => getTvl(product), [product]);
  const currentPrice = useMemo(() => getCurrentPrice(product), [product]);

  const isQuantAmmWeighted = useMemo(() => {
    const typeStr = String(product.type ?? '').toUpperCase();
    return (
      Boolean(product.quantAmmWeightedParams) ||
      (typeStr.includes('QUANT') && typeStr.includes('WEIGHTED'))
    );
  }, [product.quantAmmWeightedParams, product.type]);

  const scoreSummary: ScoreSummary | undefined = useMemo(() => {
    if (!product.overview || product.overview.length === 0) return undefined;

    const total = product.overview.reduce((acc, item) => {
      const v = typeof item.value === 'number' ? item.value : 0;
      return acc + v;
    }, 0);

    const max = product.overview.reduce((acc, item) => acc + item.maxScore, 0);
    if (max <= 0) return undefined;

    const percent = Math.max(0, Math.min(100, Math.round((total / max) * 100)));
    const normalizedToMaxScore = (total / max) * MAX_SCORE;
    const color = getScoreColor(normalizedToMaxScore);

    return { total, max, percent, color };
  }, [product.overview]);

  const tokenSummary = useMemo(() => {
    const constituents = product.poolConstituents ?? [];
<<<<<<< Updated upstream
    if (constituents.length === 0) return { top: [] as TokenSummaryItem[], rest: 0 };

    const totalWeight = constituents.reduce((acc, t) => acc + t.weight, 0);
    if (totalWeight <= 0) return { top: [] as TokenSummaryItem[], rest: 0 };
=======
    const base = { top: [] as TokenSummaryItem[], rest: 0, all: [] as TokenSummaryItem[] };
    if (constituents.length === 0) return base;

    const totalWeight = constituents.reduce((acc, t) => acc + t.weight, 0);
    if (totalWeight <= 0) return base;
>>>>>>> Stashed changes

    const sorted = [...constituents]
      .sort((a, b) => b.weight - a.weight)
      .map<TokenSummaryItem>((t) => ({
        coin: t.coin,
        pct: (t.weight / totalWeight) * 100,
      }));

    const top = sorted.slice(0, 3);
    const rest = Math.max(sorted.length - top.length, 0);

    return { top, rest, all: sorted };
  }, [product.poolConstituents]);

  const performance = useMemo(() => {
    try {
      const node = getCurrentPerformanceComponent(product);
      const text = extractTextFromNode(node);
      const numeric = parsePercentText(text);

      if (numeric === undefined) {
        return { node, text: undefined, numeric: undefined, formatted: undefined };
      }

      const formatted = `${numeric.toFixed(2)}%`;
      return { node, text, numeric, formatted };
    } catch {
      return { node: null, text: undefined, numeric: undefined, formatted: undefined };
    }
  }, [product]);

  const overviewTypeLabel = useMemo(() => {
    const raw =
      product.tokenType && product.tokenType !== 'UNKNOWN'
        ? product.tokenType
        : String(product.type);
    return humanizeEnum(raw);
  }, [product.tokenType, product.type]);

  const overviewStrategyLabel = useMemo(() => {
    const raw =
      product.strategy && product.strategy !== 'NONE' ? String(product.strategy) : 'CONSTANT';
    return humanizeEnum(raw);
  }, [product.strategy]);

  const overviewFrequencyLabel = useMemo(() => {
    const raw = product.frequency ? String(product.frequency) : '';
    return humanizeEnum(raw);
  }, [product.frequency]);

  const overviewTooltip = useMemo(() => {
    const created = safeIsoDate(product.createTime);
<<<<<<< Updated upstream
    const rows: Array<{ k: string; v: string }> = [
=======
    const rows: { k: string; v: string }[] = [
>>>>>>> Stashed changes
      { k: 'Type', v: overviewTypeLabel || '—' },
      { k: 'Strategy', v: overviewStrategyLabel || '—' },
    ];

    if (product.market) rows.push({ k: 'Market', v: humanizeEnum(product.market) });
    if (product.frequency) rows.push({ k: 'Frequency', v: overviewFrequencyLabel || '—' });
    if (created) rows.push({ k: 'Created', v: created });

    return (
      <div style={{ maxWidth: 260 }}>
        <Text strong>Overview</Text>
        <div style={{ marginTop: 6 }}>
          {rows.map((r) => (
            <div
              key={r.k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 12 }}>{r.k}</Text>
              <Text style={{ fontSize: 12 }}>{r.v}</Text>
            </div>
          ))}
        </div>
      </div>
    );
  }, [
    overviewFrequencyLabel,
    overviewStrategyLabel,
    overviewTypeLabel,
    product.createTime,
    product.frequency,
    product.market,
  ]);

  const overviewTags = useMemo(() => {
    // QuantAmm Weighted: show Frequency + Strategy
    if (isQuantAmmWeighted) {
      return [overviewFrequencyLabel || '—', overviewStrategyLabel || '—'].filter(Boolean);
    }

    // Non-QuantAmm: Strategy then Type
    return [overviewStrategyLabel || '—', overviewTypeLabel || '—'].filter(Boolean);
  }, [isQuantAmmWeighted, overviewFrequencyLabel, overviewStrategyLabel, overviewTypeLabel]);

  const scoreTooltipTitle = useMemo(() => {
    if (!product.overview || product.overview.length === 0) return null;

    return (
      <div className={styles['product-item-graph']} style={{ padding: 6 }}>
        <ProductItemOverviewGraph
          data={product.overview}
          isDarkTheme={isDarkTheme}
<<<<<<< Updated upstream
          wide={true}
=======
          wide={false}
>>>>>>> Stashed changes
          showScoreOverall={true}
        />
      </div>
    );
  }, [isDarkTheme, product.overview]);

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
            {/* Name / Chain */}
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

            {/* TVL */}
            <Col span={2} className={styles['product-item__card-column']}>
              <Text className={styles['product-item__card-under-body__text']}>
                <span style={{ color: 'var(--secondary-text-color)' }}>
                  {tvl ? tvl : <Spin />}
                </span>
              </Text>
            </Col>

<<<<<<< Updated upstream
            {/* Share Price */}
            <Col span={2} className={styles['product-item__card-column']}>
              <Text className={styles['product-item__card-under-body__text']}>
                <span style={{ color: 'var(--secondary-text-color)' }}>
                  {currentPrice ? currentPrice : <Spin />}
                </span>
              </Text>
=======
                  {/* Overview */}
                  <Col span={3} className={styles['product-item__card-column']}>
                    <Tooltip title={overviewTooltip}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                      {overviewTags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                    </Tooltip>
                  </Col>

                  {/* Tokens */}
                  <Col span={3} className={styles['product-item__card-column']}>
                    {tokenSummary.top.length > 0 ? (
                    <Tooltip
                      title={
                      <div style={{ maxWidth: 240 }}>
                        <Text strong>Token composition</Text>
                        <div style={{ marginTop: 6 }}>
                        {tokenSummary.all.map((t) => (
                          <div
                          key={t.coin}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 12,
                          }}
                          >
                          {t.coin.length > 6 ? 
                            <Tooltip title={t.coin}>
                            <span>{`${t.coin.slice(0, 6)}…`}</span>
                            </Tooltip>
                           : 
                          <Text>
                            {t.coin}
                          </Text>}
                          <Text style={{ fontSize: 12 }}>{formatPct(t.pct)}</Text>
                          </div>
                        ))}
                        </div>
                      </div>
                      }
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                        {tokenSummary.top.map((t) => (
                        <Tag key={t.coin}>
                          {t.coin} {formatPct(t.pct)}
                        </Tag>
                        ))}
                        {tokenSummary.rest > 0 && <Tag>+{tokenSummary.rest}</Tag>}
                      </div>
                      </div>
                    </Tooltip>
                    ) : (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <Text style={{ fontSize: 12, color: 'var(--secondary-text-color)' }}>
                      —
                      </Text>
                    </div>
                    )}
                  </Col>
            {/* Performance (2dp) */}
            <Col span={2} className={styles['product-item__card-column']}>
              {performance.formatted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Tag
                    color={
                      performance.numeric !== undefined && performance.numeric >= 0 ? 'green' : 'red'
                    }
                  >
                    {performance.formatted}
                  </Tag>
                </div>
              ) : performance.node ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Tag>{performance.node}</Tag>
                </div>
              ) : (
                <Text style={{ fontSize: 12, color: 'var(--secondary-text-color)' }}>
                  —
                </Text>
              )}
>>>>>>> Stashed changes
            </Col>

            {/* APR (reuse existing tooltip component) */}
            <Col
              span={2}
              className={styles['product-item__card-column']}
              style={{ padding: 0 }}
            >
              {product.dynamicData?.aprItems?.length ? (
                <ProductItemApr product={product} />
              ) : (
                <Text style={{ fontSize: 12, color: 'var(--secondary-text-color)' }}>
                  —
                </Text>
              )}
            </Col>

            {/* Scores (thicker gauge; score inside; tooltip shows radar plot) */}
            <Col
              span={3}
              className={styles['product-item__card-column']}
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              {scoreSummary ? (
                <Tooltip title={scoreTooltipTitle}>
                  <div style={{ width: '100%', padding: '0 6px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Progress
                        percent={scoreSummary.percent}
<<<<<<< Updated upstream
                        size="small"
=======
                        size={{
                          height: 30,
                        }}
>>>>>>> Stashed changes
                        showInfo={false}
                        strokeColor={scoreSummary.color}
                        strokeWidth={10}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none',
<<<<<<< Updated upstream
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#000' }}>
=======
                          marginTop:40
                        }}
                      >
                        <Text style={{ fontSize: 11, color: scoreSummary.color }}>
>>>>>>> Stashed changes
                          {scoreSummary.total}/{scoreSummary.max}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ) : (
                <Spin />
              )}
            </Col>

<<<<<<< Updated upstream
            {/* Overview */}
            <Col span={2} className={styles['product-item__card-column']}>
              <Tooltip title={overviewTooltip}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {overviewTags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </Tooltip>
            </Col>

            {/* Performance (2dp) */}
            <Col span={2} className={styles['product-item__card-column']}>
              {performance.formatted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Text strong style={{ fontSize: 12 }}>
                    Perf.
                  </Text>
                  <Tag
                    color={
                      performance.numeric !== undefined && performance.numeric >= 0 ? 'green' : 'red'
                    }
                  >
                    {performance.formatted}
                  </Tag>
                </div>
              ) : performance.node ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Text strong style={{ fontSize: 12 }}>
                    Perf.
                  </Text>
                  <Tag>{performance.node}</Tag>
                </div>
              ) : (
                <Text style={{ fontSize: 12, color: 'var(--secondary-text-color)' }}>
                  —
                </Text>
              )}
            </Col>

            {/* Tokens */}
            <Col span={3} className={styles['product-item__card-column']}>
              {tokenSummary.top.length > 0 ? (
                <Tooltip
                  title={
                    <div style={{ maxWidth: 240 }}>
                      <Text strong>Token composition</Text>
                      <div style={{ marginTop: 6 }}>
                        {tokenSummary.all.map((t) => (
                          <div
                            key={t.coin}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 12,
                            }}
                          >
                            <Text style={{ fontSize: 12 }}>{t.coin}</Text>
                            <Text style={{ fontSize: 12 }}>{formatPct(t.pct)}</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Text strong style={{ fontSize: 12 }}>
                      Tokens
                    </Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tokenSummary.top.map((t) => (
                        <Tag key={t.coin}>
                          {t.coin} {formatPct(t.pct)}
                        </Tag>
                      ))}
                      {tokenSummary.rest > 0 && <Tag>+{tokenSummary.rest}</Tag>}
                    </div>
                  </div>
                </Tooltip>
              ) : (
                <Text style={{ fontSize: 12, color: 'var(--secondary-text-color)' }}>
                  —
                </Text>
              )}
            </Col>
=======
>>>>>>> Stashed changes

            {/* Actions */}
            <Col span={3} className={styles['product-item__card-column-right']}>
              <div className={styles['product-item__card__action']}>
<<<<<<< Updated upstream
                <Button size="small" type="link">
=======
                <Button size="large" type="link">
>>>>>>> Stashed changes
                  <Link to={`${product.chain}/${product.id}`}>details</Link>
                </Button>

                <Tooltip
                  title={
                    acceptedTerms
                      ? undefined
                      : 'Please accept the terms and conditions to deposit.'
                  }
                >
                  <Button
<<<<<<< Updated upstream
                    size="small"
=======
                    size="large"
>>>>>>> Stashed changes
                    type="primary"
                    onClick={showProductModal}
                    disabled={!acceptedTerms}
                  >
                    deposit
                  </Button>
                </Tooltip>
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
